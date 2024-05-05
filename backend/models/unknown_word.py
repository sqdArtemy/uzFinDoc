from db_init import db


class UnknownWord(db.Model):
    __tablename__ = 'UnknownWord'

    written_form = db.Column(db.String(255), nullable=False, primary_key=True)
    reporter_id = db.Column(db.Integer, db.ForeignKey('User.id'), nullable=False, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('Document.id'), nullable=False, primary_key=True)
    possible_translation = db.Column(db.String(255), nullable=True)

    def __repr__(self):
        return f"UnknownWord: {self.written_form}"
