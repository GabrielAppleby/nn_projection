import {Dataset, Projection} from "../types/data";
import {env} from "../env";

export const API_URL: string = env("REACT_APP_API");

export const getDatasetEndpoint = (name: Dataset) => {
    if (name === 'digit') {
        return '/digit'
    } else if (name === 'fashion') {
        return '/fashion'
    }
}

export const getModelEndpoint = (dataset: Dataset, projection: Projection) => {
    let beginning = ''
    if (projection === 'tsne') {
        beginning += '/tsne'
    } else if (projection === 'umap') {
        beginning += '/umap'
    }
    return beginning + getDatasetEndpoint(dataset);
}
