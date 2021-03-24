import numpy as np

from typing import Dict, List

from flask_restful import fields, Resource

from app.core.fashion import Fashion
from app.api.paginator import pagination
from app.dao.fashion_dao import FashionDB


class BytesField(fields.Raw):
    def format(self, value):
        return np.frombuffer(value).tolist()


# class BytesField(fields.String):
#     def format(self, value):
#         return super().format(base64.b64encode(value))


fashion_fields: Dict = {
    "uid": fields.Integer,
    "label": fields.String,
    "features": BytesField
}


class FashionListAPI(Resource):
    def get(self) -> List[Fashion]:
        return pagination.paginate(FashionDB, fashion_fields)


class FashionAPI(Resource):
    def get(self, uid) -> Fashion:
        return pagination.paginate(FashionDB.query.filter_by(uid=uid), fashion_fields)
