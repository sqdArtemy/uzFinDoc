from db_init import db


class UnknownWord(db.Model):
    __tablename__ = 'UnknownWord'

    """
    CREATE TABLE UnknownWord (
    written_form VARCHAR(255) NOT NULL,
    reporter_id INTEGER NOT NULL,
    document_id INTEGER NOT NULL,
    possible_translation VARCHAR(255),
    PRIMARY KEY (written_form, reporter_id, document_id),
    CONSTRAINT fk_reporter_id FOREIGN KEY (reporter_id) REFERENCES "User"(id) ON DELETE CASCADE,
    CONSTRAINT fk_document_id FOREIGN KEY (document_id) REFERENCES Document(id) ON DELETE CASCADE
    );
    """

    written_form = db.Column(db.String(255), nullable=False, primary_key=True)
    reporter_id = db.Column(db.Integer, db.ForeignKey('User.id'), nullable=False, primary_key=True)
    document_id = db.Column(db.Integer, db.ForeignKey('Document.id'), nullable=False, primary_key=True)
    possible_translation = db.Column(db.String(255), nullable=True)

    def __repr__(self):
        return f"UnknownWord: {self.written_form}"
