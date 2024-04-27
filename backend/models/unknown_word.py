from db_init import db


class UnknownWord(db.Model):
    __tablename__ = 'UnknownWord'

    written_form = db.Column(db.String(255), nullable=False)
    reporter_id = db.Column(db.Integer, db.ForeignKey('User.id'), nullable=False)
    document_id = db.Column(db.Integer, db.ForeignKey('Document.id'), nullable=False)
    possible_translation = db.Column(db.String(255), nullable=True)

    def __repr__(self):
        return f"UnknownWord: {self.written_form}"
