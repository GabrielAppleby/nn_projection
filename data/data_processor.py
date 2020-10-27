import os
from typing import Tuple, Iterable, List

import numpy as np
from cuml.manifold.umap import UMAP as cuUMAP
from sklearn.datasets import load_wine, fetch_openml
from sklearn.preprocessing import StandardScaler
from sklearn.utils import shuffle

DATA_FOLDER: str = os.path.dirname(os.path.realpath(__file__))
WINE_FILE_NAME: str = 'wine_umap.npz'
DIGITS_FILE_NAME: str = 'digits_umap.npz'
FASHION_FILE_NAME: str = 'fashion_umap.npz'


def load_dataset(dataset_name):
    """
    Loads the processed data set.
    :param filename: The properly formatted files' name.
    :return: The features, labels, and projection data.
    """
    data = np.load(os.path.join(DATA_FOLDER, dataset_name), allow_pickle=True)
    features = data['features']
    labels = data['labels']
    projections = data['projections']

    return features, labels, projections


def fetch_wine() -> Tuple[np.ndarray, np.ndarray]:
    """
    Fetches the wine dataset from another source.
    :return: The features and labels matrices of the dataset.
    """
    x, y = load_wine(return_X_y=True)
    y = y.reshape(-1, 1)
    return x, y


def fetch_digits() -> Tuple[np.array, np.array]:
    """
    Fetches the mnist dataset from another source.
    :return: The features and labels matrices of the dataset.
    """
    features, labels = fetch_openml("mnist_784", version=1, return_X_y=True)
    return features, labels


def fetch_fashion() -> Tuple[np.array, np.array]:
    """
    Fetches the mnist dataset from another source.
    :return: The features and labels matrices of the dataset.
    """
    features, labels = fetch_openml("Fashion-MNIST", version=1, return_X_y=True)
    return features, labels


def scale_dataset(features: np.ndarray) -> np.ndarray:
    """
    Standardize features by removing the mean and scaling to unit variance.
    :param features: The features matrix of the dataset.
    :return: The scaled features matrix of the dataset.
    """
    return StandardScaler().fit_transform(features)


def normalize_data(data: np.array) -> np.array:
    """
    Normalizes the data to between 0 and 1.
    :param data: The data to be normalized.
    :return: The data, now between 0 and 1.
    """
    min = np.min(data, axis=0)
    data = data - min
    max = np.max(data, axis=0)
    data = np.divide(data, max, out=np.zeros_like(data), where=max != 0)
    return data


def create_projection_dataset(
        features: np.ndarray,
        labels: np.ndarray,
        neighbors: Iterable[int]) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    Projects the features at various number of neighbors. And formats all the data into the format
    a model would expect if trying to learn the projection.
    :param features: The features to project.
    :param labels: The labels of the features.
    :param neighbors: The different selections of number of neighbors.
    :return: The formatted projection dataset.
    """
    projections = []
    augmented_features = []
    repreated_labels = []
    for num_neighbors in neighbors:
        projections.append(
            normalize_data(cuUMAP(n_neighbors=num_neighbors).fit_transform(features)))
        augmented_features.append(np.concatenate(
            (np.full(shape=(features.shape[0], 1), fill_value=num_neighbors), features), axis=1))
        repreated_labels.append(labels)
    return np.concatenate(augmented_features, axis=0), np.concatenate(projections,
                                                                      axis=0), np.concatenate(
        repreated_labels, axis=0)


def main():
    np.random.seed(42)
    number_of_neighbors = (2, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85,
                           90, 95, 100)

    datasets: List[Tuple] = [(fetch_digits, DIGITS_FILE_NAME)]
    for dataset_fetch_fnc, dataset_file_name in datasets:
        features, labels = dataset_fetch_fnc()
        scaled_features = scale_dataset(features)
        augmented_features, projections, labels = create_projection_dataset(scaled_features,
                                                                            labels,
                                                                            number_of_neighbors)
        augmented_features, projections, labels = shuffle(augmented_features, projections, labels)
        np.savez(dataset_file_name,
                 features=augmented_features,
                 labels=labels,
                 projections=projections)


if __name__ == '__main__':
    main()
