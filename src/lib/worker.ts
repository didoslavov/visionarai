import { pipeline, env, type PipelineType } from '@xenova/transformers';

env.allowLocalModels = false;

type ResolvedPipelineInstance = Awaited<ReturnType<typeof pipeline>>;

interface PipelineOptions {
    progress: boolean;
}

class PipelineSingleton {
    static instance: Map<string, ResolvedPipelineInstance> = new Map();

    static async getInstance(task: PipelineType, model: string): Promise<ResolvedPipelineInstance> {
        const key = `${task}-${model}`;
        if (!this.instance.has(key)) {
            const instance = await pipeline(task, model, {
                progress_callback: (progress: number) => {
                    self.postMessage(progress);
                },
            });
            this.instance.set(key, instance);
        }
        return this.instance.get(key)!;
    }
}

type DetectorFunction = (input: string, options?: PipelineOptions) => Promise<ResolvedPipelineInstance>;

self.addEventListener('message', async (event: MessageEvent<{ input: string; task: PipelineType; model: string }>) => {
    const detector = await PipelineSingleton.getInstance(event.data.task, event.data.model);
    const detectorFunc: DetectorFunction = detector as unknown as DetectorFunction;
    const result = await detectorFunc(event.data.input);

    self.postMessage({ status: 'complete', result });
});
