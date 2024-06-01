'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { BiCheckDouble } from 'react-icons/bi';
import ObjectDetectionContent from '@/components/layout/object-detection';
import Status from '@/components/ui/status';
import ModelHeader from '@/components/ui/model-header';

export type TransformerData = {
    score: number;
    label: string;
    box: {
        xmin: number;
        ymin: number;
        xmax: number;
        ymax: number;
    };
};

export default function ObjectDetection() {
    const [result, setResult] = useState<TransformerData[] | null>(null);
    const [progress, setProgress] = useState(0);
    const [ready, setReady] = useState<boolean | null>(null);
    const [status, setStatus] = useState('loading');

    const worker = useRef<Worker | null>(null);

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker(new URL('../../lib/worker.ts', import.meta.url), { type: 'module' });
        }

        const onMessageReceived = (e: { data: { status: string; progress: number; result: TransformerData[] } }) => {
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
                    setStatus('complete');
                    setResult(e.data.result);
                    break;
            }
        };

        worker.current.addEventListener('message', onMessageReceived);

        return () => worker.current?.removeEventListener('message', onMessageReceived);
    });

    const detector = useCallback((image: File) => {
        if (worker.current) {
            worker.current.postMessage({ input: image, task: 'object-detection', model: 'Xenova/detr-resnet-50' });
        }
    }, []);

    return (
        <section className="py-12 flex-1">
            <div className="container w-full md:max-w-4xl">
                <div className="flex sm:flex-row flex-col sm:justify-between gap-2 sm:gap-0 sm:items-end">
                    <ModelHeader heading="Object Detection" sub="in images using HuggingFace and Transformers.js" />
                    <Status ready={ready} progress={progress} />
                </div>
                <ObjectDetectionContent
                    status={status}
                    setStatus={setStatus}
                    detector={detector}
                    result={result}
                    setResult={setResult}
                    className="mt-10 rounded-xl border-teal-950 border-2 border-dashed p-10"
                />
            </div>
        </section>
    );
}
