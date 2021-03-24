declare module 'comlink-loader!*' {

    import {Dataset, Projection} from "../types/data";

    class WebpackWorker extends Worker {
        constructor();

        setNumFeatures(data: number);

        setBatchSize(data: number);

        setDataset(data: Dataset);

        setProjection(data: Projection);

        getModel();

        runProjection(data: Float32Array): Promise<number[][]>
    }

    export = WebpackWorker;
}
