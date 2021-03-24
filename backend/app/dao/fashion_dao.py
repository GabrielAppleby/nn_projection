from app.dao.database import db


class FashionDB(db.Model):
    __tablename__ = 'fashion'
    uid = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(32))
    features = db.Column(db.LargeBinary())

    def __repr__(self):
        return '<Fashion {}>'.format(self.uid)
