from app.dao.database import db


class DigitDB(db.Model):
    __tablename__ = 'digits'
    uid = db.Column(db.Integer, primary_key=True)
    label = db.Column(db.String(32))
    features = db.Column(db.LargeBinary())

    def __repr__(self):
        return '<Digit {}>'.format(self.uid)
