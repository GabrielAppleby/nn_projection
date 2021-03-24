import * as tf from "@tensorflow/tfjs";
import {API_URL, getModelEndpoint} from "../api/common";
import {Dataset, Projection} from "../types/data";

let model: tf.GraphModel | null = null;
let numFeatures = 0;
let batchSize = 64;
let dataset: Dataset = 'digit';
let projection: Projection = 'umap';

export async function getModel() {
    if (model !== null) {
        model.dispose();
    }
    const endPoint = getModelEndpoint(dataset, projection) + '';
    model = await tf.loadGraphModel(`${API_URL}/models${endPoint}`);
}

export function setNumFeatures(data: number) {
    numFeatures = data;
}

export function setBatchSize(data: number) {
    batchSize = data;
}

export function setDataset(data: Dataset) {
    dataset = data;
}

export function setProjection(data: Projection) {
    projection = data;
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
