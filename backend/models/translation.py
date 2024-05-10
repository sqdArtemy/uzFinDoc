from db_init import db

from .enums import Language, TranslationStatus


class Translation(db.Model):
    __tablename__ = 'Translation'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    generated_at = db.Column(db.DateTime, nullable=False)
    details_status = db.Column(db.Enum(TranslationStatus), default=TranslationStatus.PROCESSING, nullable=False)
    details_word_count = db.Column(db.Integer, nullable=False)
    creator_id = db.Column(db.Integer, db.ForeignKey('User.id'), nullable=False)
    process_time = db.Column(db.Float, nullable=False, default=0)
    input_document_id = db.Column(db.Integer, db.ForeignKey('Document.id', ondelete="CASCADE"), nullable=False)
    output_document_id = db.Column(db.Integer, db.ForeignKey('Document.id'), nullable=False)
    organization_id = db.Column(db.Integer, db.ForeignKey('Organization.id', ondelete="SET NULL"), nullable=True)

    def __repr__(self) -> str:
        return f"{self.id}-{self.generated_at}"

    organization = db.relationship("Organization", backref="translations", lazy=True)
    feedback = db.relationship(
        "Feedback",
        backref="translation",
        primaryjoin="Translation.id==Feedback.translation_id",
        lazy="joined"
    )
    input_document = db.relationship(
        "Document",
        backref="translation_in",
        primaryjoin="Document.id == Translation.input_document_id",
        lazy="joined"
    )
    output_document = db.relationship(
        "Document",
        backref="translation_out",
        primaryjoin="Document.id == Translation.output_document_id",
        lazy="joined"
    )
    creator = db.relationship(
        "User",
        backref="translations",
        primaryjoin="User.id == Translation.creator_id",
        lazy="joined"
    )
