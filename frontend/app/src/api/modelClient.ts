import * as tf from "@tensorflow/tfjs";
import {API_URL} from "./common";

export async function getModel(path: string, config?: tf.io.LoadOptions): Promise<tf.GraphModel> {
    return await tf.loadGraphModel(`${API_URL}/models${path}`, config);
}
