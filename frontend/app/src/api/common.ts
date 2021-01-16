import {Dataset} from "../types/data";
import {env} from "../env";

export const API_URL: string = env("REACT_APP_API");

export const getDatasetEndpoint = (name: Dataset) => {
    if (name === 'mnist') {
        return '/digit'
    }
}
