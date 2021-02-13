export type Dataset = 'mnist';
export type Projection = 'umap'
export type Status = 'idle' | 'pending' | 'fulfilled' | 'rejected';

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
