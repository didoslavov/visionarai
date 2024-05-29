'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Progress } from '@/components/ui/progress';
import { BiCheckDouble } from 'react-icons/bi';
import Dropzone from '@/components/layout/dropzone';

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

export default function Home() {
    const [result, setResult] = useState<TransformerData[] | null>(null);
    const [progress, setProgress] = useState(0);
    const [ready, setReady] = useState<boolean | null>(null);
    const [status, setStatus] = useState('loading');

    const worker = useRef<Worker | null>(null);

    useEffect(() => {
        if (!worker.current) {
            worker.current = new Worker(new URL('../lib/worker.ts', import.meta.url), { type: 'module' });
        }

        const onMessageReceived = (e: { data: { status: string; progress: number; result: TransformerData[] } }) => {
            switch (e.data.status) {
                case 'initiate':
                    setStatus('initiate');
                    setReady(false);
                    break;
                case 'progress':
                    setStatus('progress');
                    setProgress(Math.ceil(e.data.progress));
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
            worker.current.postMessage({ image });
        }
    }, []);

    return (
        <section className="py-12">
            <div className="container max-w-4xl">
                <div className="flex justify-between items-end">
                    <div>
                        <h1 className="text-4xl font-bold text-zinc-800">Detect objects</h1>
                        <h3 className="text-lg text-zinc-600">in images using HuggingFace and Transformers.js</h3>
                    </div>
                    {ready ? (
                        <div className="flex font-bold items-center justify-end gap-2 text-emerald-600">
                            <p>Transformer Ready</p>
                            <BiCheckDouble className="text-3xl" />
                        </div>
                    ) : (
                        <div className="text-end">
                            <p>Transformer status</p>
                            {progress > 0 && !ready && <Progress value={progress} />}
                        </div>
                    )}
                </div>
                <Dropzone
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
