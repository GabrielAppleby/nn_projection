export type Dataset = 'mnist';
export type Projection = 'umap'
export type Status = 'idle' | 'pending' | 'fulfilled' | 'rejected';
export type DataSize = 500 | 1000 | 5000 | 10000 | 20000;
export type BatchSize = 32 | 64 | 128 | 256 | 512 | 1024;
export type PlotType = 'svg' | 'webgl';


export const DATA_SIZES: DataSize[] = [500, 1000, 5000, 10000, 20000];
export const BATCH_SIZES: BatchSize[] = [32, 64, 128, 256, 512, 1024];

export interface Instance {
    uid: number
    label: string
}

export interface DataInstance extends Instance {
    features: number[]
}

export interface ProjectedInstance extends Instance {
    projections: number[]
}

export type Data = DataInstance[]
export type Projections = ProjectedInstance[]
