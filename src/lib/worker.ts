import { pipeline, env, PipelineType } from '@xenova/transformers';

env.allowLocalModels = false;

type ResolvedPipelineInstance = Awaited<ReturnType<typeof pipeline>>;

interface PipelineOptions {
    progress?: boolean;
}

class Pipeline {
    static task: PipelineType = 'object-detection';
    static model = 'Xenova/detr-resnet-50';
    static instance: ResolvedPipelineInstance | null = null;

    static async getInstance(progress_callback: Function | undefined): Promise<ResolvedPipelineInstance> {
        if (!this.instance) {
            this.instance = await pipeline(this.task, this.model, { progress_callback });
        }
        return this.instance;
    }
}

type DetectorFunction = (input: string, options: PipelineOptions) => Promise<any>;

self.addEventListener('message', async (event: MessageEvent<{ image: string }>) => {
    const detector = await Pipeline.getInstance((progress: string) => {
        self.postMessage(progress);
    });
    const detectorFunc: DetectorFunction = detector as DetectorFunction;
    const result = await detectorFunc(event.data.image, { progress: true });

    self.postMessage({ status: 'complete', result });
});
