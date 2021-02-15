import * as tf from "@tensorflow/tfjs";
import {API_URL} from "../api/common";

let model: tf.LayersModel | null = null;
let numFeatures = 0;
let batchSize = 64;

export async function getModel() {
    if (model !== null) {
        model.dispose();
    }
    model = await tf.loadLayersModel(`${API_URL}/models/digit`);
}

export function setNumFeatures(data: number) {
    numFeatures = data;
}

export function setBatchSize(data: number) {
    batchSize = data;
}

export async function runProjection(data: Float32Array) {
    if (model !== null && numFeatures !== 0) {
        const features = tf.tensor(data).reshape([-1, numFeatures]);
        const tfPredictions = (model.predict(features, {batchSize: batchSize}) as tf.Tensor<tf.Rank.R2>);
        const predictions = await tfPredictions.array();
        tf.dispose(features);
        tf.dispose(tfPredictions);

        return predictions;
    }
}
