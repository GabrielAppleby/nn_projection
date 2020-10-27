import tensorflow as tf
from kerastuner import HyperParameters


def build_model(hp: HyperParameters, output_size: int) -> tf.keras.Model:
    model = tf.keras.Sequential()
    has_bn = hp.Choice('has_bn', [True, False])
    dropout = hp.Float('dropout', min_value=0.0, max_value=.5, step=.25)
    for i in range(hp.Int('num_layers', 2, 10)):
        model.add(tf.keras.layers.Dense(units=hp.Int('units_' + str(i),
                                                     min_value=32,
                                                     max_value=512,
                                                     step=32),
                                        activation='relu'))
        if has_bn:
            model.add(tf.keras.layers.BatchNormalization())
            model.add(tf.keras.layers.Dropout(dropout))
    model.add(tf.keras.layers.Dense(hp.Fixed('output_size', output_size), activation='softmax'))
    model.compile(optimizer='adam', loss='mse')

    return model
