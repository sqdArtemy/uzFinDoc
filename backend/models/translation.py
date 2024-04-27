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
    creator_id = db.Column(db.Integer, db.ForeignKey('User.id'), nullable=False)
    input_document_id = db.Column(db.Integer, db.ForeignKey('Document.id', ondelete="CASCADE"), nullable=False)
    output_document_id = db.Column(db.Integer, db.ForeignKey('Document.id'), nullable=False)
    organization_id = db.Column(db.Integer, db.ForeignKey('Organization.id', ondelete="SET NULL"), nullable=True)

    def __repr__(self) -> str:
        return f"{self.language} - {self.generated_at}"
