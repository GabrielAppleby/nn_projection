import numpy as np
import tensorflow as tf
from kerastuner import BayesianOptimization
from sklearn.model_selection import train_test_split

from data.data_processor import load_dataset, DIGITS_FILE_NAME

from models.models import build_model


def main():
    np.random.seed(42)
    features, labels, projections = load_dataset(DIGITS_FILE_NAME)

    features_train, features_val, projections_train, projections_val = train_test_split(
        features, projections, train_size=.8)

    tuner: BayesianOptimization = BayesianOptimization(
        build_model,
        objective='val_loss',
        max_epochs=300,
        max_trials=5,
        executions_per_trial=3,
        directory='results')

    tuner.search(x=features_train,
                 y=projections_train,
                 validation_data=(features_val, projections_val),
                 callbacks=[tf.keras.callbacks.EarlyStopping(verbose=0,
                                                             patience=6,
                                                             restore_best_weights=True)])


if __name__ == '__main__':
    main()
