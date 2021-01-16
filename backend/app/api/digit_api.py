import numpy as np

from typing import Dict, List

from flask_restful import fields, Resource, marshal_with

from app.core.digit import Digit
from app.dao.digits_dao import DigitDB


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
    @marshal_with(digit_fields)
    def get(self) -> List[Digit]:
        return DigitDB.query.all()


class DigitAPI(Resource):
    @marshal_with(digit_fields)
    def get(self, uid) -> Digit:
        return DigitDB.query.get_or_404(uid)


