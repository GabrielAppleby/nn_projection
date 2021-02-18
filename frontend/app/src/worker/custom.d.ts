declare module 'comlink-loader!*' {

    class WebpackWorker extends Worker {
        constructor();

        setNumFeatures(data: number);

        setBatchSize(data: number);

        getModel();

        runProjection(data: Float32Array): Promise<number[][]>
    }

    export = WebpackWorker;
}
