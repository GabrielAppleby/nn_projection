import numpy as np

from typing import Dict, List

from flask_restful import fields, Resource, marshal_with

from app.core.digit import Digit
from app.dao.digits_dao import DigitDB
from app.api.paginator import pagination


class BytesField(fields.Raw):
    def format(self, value):
        return np.frombuffer(value).tolist()


# class BytesField(fields.String):
#     def format(self, value):
#         return super().format(base64.b64encode(value))


digit_fields: Dict = {
    "uid": fields.Integer,
    "label": fields.String,
    "features": BytesField
}


class DigitListAPI(Resource):
    def get(self) -> List[Digit]:
        return pagination.paginate(DigitDB, digit_fields)


class DigitAPI(Resource):
    def get(self, uid) -> Digit:
        return pagination.paginate(DigitDB.query.filter_by(uid=uid), digit_fields)
