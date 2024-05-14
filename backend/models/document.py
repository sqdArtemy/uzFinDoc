from datetime import datetime, timezone

from db_init import db
from .enums import DocumentType, Language


class Document(db.Model):
    __tablename__ = "Document"

    """
    CREATE TABLE Document (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        format VARCHAR(20) NOT NULL,
        text TEXT NOT NULL,
        uploaded_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
        link VARCHAR(255) NOT NULL UNIQUE,
        type VARCHAR NOT NULL,
        language VARCHAR NOT NULL
    );
    """

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(255), nullable=False)
    format = db.Column(db.String(20), nullable=False)
    text = db.Column(db.Text, nullable=False)
    uploaded_at = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc).isoformat())
    link = db.Column(db.String(255), nullable=False, unique=True)
    type = db.Column(db.Enum(DocumentType), nullable=False)
    language = db.Column(db.Enum(Language), nullable=False)

    def __repr__(self):
        return f"{self.name}.{self.format}"
