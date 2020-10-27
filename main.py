import numpy as np
import tensorflow as tf
from kerastuner import BayesianOptimization
from sklearn.model_selection import train_test_split

from data.data_processor import load_dataset, DIGITS_FILE_NAME

from models.models import build_model


def main():
    np.random.seed(42)
    features, labels, projections = load_dataset(DIGITS_FILE_NAME)

    features_both, features_test, projections_both, projections_test = train_test_split(
        features, projections, train_size=.2)

    features_train, features_val, projections_train, projections_val = train_test_split(
        features_both, projections_both, train_size=.8)

    tuner: BayesianOptimization = BayesianOptimization(
        build_model,
        objective='val_loss',
        max_trials=40,
        executions_per_trial=3,
        directory='results')

    tuner.search(x=features_train,
                 y=projections_train,
                 epochs=300,
                 verbose=0,
                 validation_data=(features_val, projections_val),
                 callbacks=[tf.keras.callbacks.EarlyStopping(verbose=0,
                                                             patience=1,
                                                             restore_best_weights=True)])


if __name__ == '__main__':
    main()
