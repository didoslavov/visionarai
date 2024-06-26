'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import ModelHeader from '@/components/ui/model-header';
import Status from '@/components/ui/status';
import EmbeddedSearch from '@/components/layout/embedded-search';
import { cos_sim } from '@xenova/transformers';

export type EmbeddingData = number[][];
export type EmbeddingResult = { text: string; similarity: number }[];

export default function SemanticSearch() {
    const [result, setResult] = useState<EmbeddingResult | null>(null);
    const [progress, setProgress] = useState(0);
    const [ready, setReady] = useState<boolean | null>(null);
    const [status, setStatus] = useState('loading');
    const [queryVector, setQueryVector] = useState<number[]>([]);
    const [textVectors, setTextVectors] = useState<number[][]>([]);
    const [texts, setTexts] = useState<string[]>([]);

    const worker = useRef<Worker | null>(null);

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker(new URL('../../lib/worker.ts', import.meta.url), { type: 'module' });
        }

        const onMessageReceived = (e: { data: { status: string; progress: number; result: EmbeddingData } }) => {
            switch (e.data.status) {
                case 'initiate':
                    setStatus('initiate');
                    setReady(false);
                    setProgress(0);
                    break;
                case 'progress':
                    setStatus('progress');
                    setProgress(e.data.progress);
                    break;
                case 'ready':
                    setStatus('ready');
                    setReady(true);
                    break;
                case 'complete':
                    if (e.data.result.length === 1) {
                        setQueryVector(e.data.result[0]);
                    } else {
                        setTextVectors(e.data.result);
                    }
                    setStatus('complete');
                    break;
            }
        };

        worker.current.addEventListener('message', onMessageReceived);

        return () => worker.current?.removeEventListener('message', onMessageReceived);
    }, []);

    const handleExtractFeatures = useCallback((texts: string[], query: string) => {
        setTexts(texts);
        setStatus('processing');

        if (worker.current) {
            worker.current.postMessage({ input: [query], task: 'feature-extraction', model: 'Xenova/all-MiniLM-L6-v2' });
        }

        if (worker.current) {
            worker.current.postMessage({ input: texts, task: 'feature-extraction', model: 'Xenova/all-MiniLM-L6-v2' });
        }
    }, []);

    useEffect(() => {
        if (status === 'complete' && queryVector.length > 0 && textVectors.length > 0) {
            const similarities = textVectors.map((embedding: number[]) => cos_sim(embedding, queryVector));

            const sortedTexts = texts
                .map((text, index) => {
                    const similarityPercentage = Math.round(similarities[index] * 100);
                    return { text, similarity: similarityPercentage };
                })
                .sort((a, b) => b.similarity - a.similarity)
                .map((item) => item);
            setResult(sortedTexts);
        }
    }, [status, queryVector, textVectors, texts]);

    return (
        <section className="py-12 flex-1">
            <div className="container max-w-4xl">
                <div className="flex sm:flex-row flex-col sm:justify-between gap-2 sm:gap-0 sm:items-end">
                    <ModelHeader heading="Text Embedding" sub="using HuggingFace and Transformers.js" />
                    <Status ready={ready} progress={progress} />
                </div>
                <EmbeddedSearch status={status} setStatus={setStatus} onExtractFeatures={handleExtractFeatures} result={result} />
            </div>
        </section>
    );
}
