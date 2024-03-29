import os

from flask import Flask
from flask_migrate import Migrate
from flask_restful import Api

from app.api.digit_api import DigitListAPI, DigitAPI
from app.api.fashion_api import FashionListAPI, FashionAPI
from app.api.paginator import pagination
from app.api.tf_model_api import TFModelAPI, TFShardAPI
from app.dao.database import db


def create_app() -> Flask:
    app: Flask = Flask(__name__, instance_relative_config=True)

    app.config.from_mapping(
        SECRET_KEY=os.environ.get('SECRET_KEY'),
        SQLALCHEMY_DATABASE_URI=os.environ.get('DB_URI'),
        SQLALCHEMY_TRACK_MODIFICATIONS=False
    )

    db.init_app(app)
    Migrate(app, db)
    pagination.init_app(app, db)

    api: Api = Api(app, prefix='/api')

    api.add_resource(DigitListAPI, '/digits')
    api.add_resource(DigitAPI, '/digits/<int:uid>')
    api.add_resource(FashionListAPI, '/fashions')
    api.add_resource(FashionAPI, '/fashions/<int:uid>')

    api.add_resource(TFModelAPI, '/models/<string:projection_name>/<string:dataset_name>')
    api.add_resource(TFShardAPI,
                     '/models/<string:projection_name>/<string:dataset_name>/<string:file_name>')

    @app.after_request
    def after_request(response):
        response.headers.add('Access-Control-Allow-Origin', '*')
        response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
        response.headers.add('Access-Control-Allow-Methods', 'GET')
        response.headers.add('Access-Control-Allow-Methods', 'PUT')

        return response

    return app


application = create_app()
