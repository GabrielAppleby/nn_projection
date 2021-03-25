export type Dataset = 'digit' | 'fashion';
export type Projection = 'umap' | 'tsne';
export type Status = 'idle' | 'pending' | 'fulfilled' | 'rejected';
export type DataSize = 500 | 1000 | 5000 | 10000 | 20000;
export type PlotType = 'svg' | 'webgl';


export const DATA_SIZES: DataSize[] = [500, 1000, 5000, 10000, 20000];

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
