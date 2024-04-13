from db_init import db
from sqlalchemy.dialects.postgresql import ENUM

from .enums import Language, TranslationStatus


class Translation(db.Model):
    __tablename__ = 'Translation'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    language = db.Column(ENUM(Language, create_type=False), nullable=False)
    generated_at = db.Column(db.DateTime, nullable=False)
    details_status = db.Column(db.Enum(TranslationStatus), default=TranslationStatus.PROCESSING, nullable=False)
    details_word_count = db.Column(db.Integer, nullable=False)

    def __repr__(self) -> str:
        return f"{self.language} - {self.generated_at}"
