from flask_restful import Resource

from app.dao.tf_model_dao import TFModelDB, TFShardDB


class TFModelAPI(Resource):

    def get(self, projection_name, dataset_name):
        return TFModelDB.get_or_404(projection_name, dataset_name)


class TFShardAPI(Resource):

    def get(self, projection_name, dataset_name, file_name):
        return TFShardDB.get_or_404(projection_name, dataset_name, file_name)
