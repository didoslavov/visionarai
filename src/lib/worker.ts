import { pipeline, env, type PipelineType } from '@xenova/transformers';

env.allowLocalModels = false;

type ResolvedPipelineInstance = Awaited<ReturnType<typeof pipeline>>;

interface PipelineOptions {
    progress?: boolean;
    percentage?: boolean;
    pooling?: 'mean' | 'max' | 'cls';
    normalize?: boolean;
}

class PipelineSingleton {
    static instance: Map<string, ResolvedPipelineInstance> = new Map();

    static async getInstance(
        task: PipelineType,
        model: string,
        { quantized }: { quantized?: boolean }
    ): Promise<ResolvedPipelineInstance> {
        const key = `${task}-${model}`;
        if (!this.instance.has(key)) {
            const instance = await pipeline(task, model, {
                progress_callback: (progress: number) => {
                    self.postMessage(progress);
                },
                quantized,
            });
            this.instance.set(key, instance);
        }
        return this.instance.get(key)!;
    }
}

type PipelineFunction = (input: string, options?: PipelineOptions) => Promise<ResolvedPipelineInstance>;

self.addEventListener('message', async (event) => {
    const { input, task, model } = event.data;

    switch (task) {
        case 'object-detection':
            const detector = await PipelineSingleton.getInstance(task, model, {});
            const detectorFunc: PipelineFunction = detector as unknown as PipelineFunction;
            const result = await detectorFunc(input, { percentage: true });

            self.postMessage({ status: 'complete', result });
            break;
        case 'feature-extraction':
            const extractor = await PipelineSingleton.getInstance(task, model, { quantized: false });
            const extractorFunc: PipelineFunction = extractor as unknown as PipelineFunction;
            const embeddings = await Promise.all(
                input.map(async (text: string) => {
                    const output = await extractorFunc(text, { pooling: 'mean', normalize: true });

                    if ('data' in output) {
                        return Array.from(output.data as ArrayLike<unknown>) as unknown as number[];
                    }
                })
            );
            self.postMessage({ status: 'complete', result: embeddings });
            break;
        default:
            console.error(`Unknown task: ${task}`);
    }
});
