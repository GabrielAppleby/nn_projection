from typing import List, Union

import numpy as np
import psycopg2

from app.core.digit import Digit
from app.core.fashion import Fashion


def fetch_dataset(dataset):
    data = np.load('{}_db_dataset.npz'.format(dataset), allow_pickle=True)
    x = data['x']
    y = data['y']
    # idxs = np.random.choice(x.shape[0], 20000, replace=False)
    return x, y
    # return x[idxs], y[idxs]


def read_data(dataset) -> List[Union[Digit, Fashion]]:
    x, y = fetch_dataset(dataset)
    digits = []
    if dataset == 'digits':
        for features, label in zip(x, y):
            digits.append(Digit(0, label, features))
    elif dataset == 'fashion':
        for features, label in zip(x, y):
            digits.append(Fashion(0, label, features))
    return digits


def main():
    datasets: List[str] = ['digits', 'fashion']
    for dataset in datasets:
        digits = read_data(dataset)
        connection = psycopg2.connect(user="dev_user",
                                      password="dev_pass",
                                      host="db",
                                      port="5432",
                                      database="dev_db")
        c = connection.cursor()
        table_info = 'INSERT INTO {} (label, features)'.format(dataset)
        for digit in digits:
            c.execute(
                table_info +
                ' VALUES (%s, %s)',
                (str(digit.label), digit.features.tobytes())
            )
        connection.commit()
        connection.close()


if __name__ == '__main__':
    main()
