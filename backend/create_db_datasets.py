from typing import List, Tuple

import numpy as np
from sklearn.datasets import fetch_openml
from sklearn.preprocessing import StandardScaler


def fetch_digits() -> Tuple[np.array, np.array]:
    """
    Fetches the mnist dataset from another source.
    :return: The features and labels matrices of the dataset.
    """
    features, labels = fetch_openml("mnist_784", version=1, return_X_y=True, as_frame=False)
    return features, labels


def fetch_fashion() -> Tuple[np.array, np.array]:
    """
    Fetches the mnist dataset from another source.
    :return: The features and labels matrices of the dataset.
    """
    features, labels = fetch_openml("Fashion-MNIST", version=1, return_X_y=True, as_frame=False)
    return features, labels


def scale_dataset(features: np.ndarray) -> np.ndarray:
    """
    Standardize features by removing the mean and scaling to unit variance.
    :param features: The features matrix of the dataset.
    :return: The scaled features matrix of the dataset.
    """
    return StandardScaler().fit_transform(features)


def sample(features, labels):
    idxs = np.random.choice(features.shape[0], 20000, replace=False)
    return features[idxs], labels[idxs]


def main():
    datasets: List[Tuple] = [(fetch_digits, 'digits'),
                             (fetch_fashion, 'fashion')]

    for dataset_fetch_fnc, dataset_name in datasets:
        features, labels = dataset_fetch_fnc()
        features, labels = sample(features, labels)
        labels = [str(i) for i in labels]
        features = scale_dataset(features)

        np.savez('{}_db_dataset.npz'.format(dataset_name),
                 x=features,
                 y=labels)


if __name__ == '__main__':
    main()
