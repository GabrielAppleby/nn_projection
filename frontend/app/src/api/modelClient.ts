import * as tf from "@tensorflow/tfjs";
import {API_URL} from "./common";

export async function getModel(path: string, config?: tf.io.LoadOptions): Promise<tf.LayersModel> {
    console.log(`${API_URL}/models/${path}`);
    return await tf.loadLayersModel(`${API_URL}/models/${path}`, config);
}
