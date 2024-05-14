from sqlalchemy import event

from db_init import db
from models.feedback import Feedback

from .enums import TranslationStatus


class Translation(db.Model):
    __tablename__ = 'Translation'

    """
    CREATE TABLE Translation (
    id SERIAL PRIMARY KEY,
    generated_at TIMESTAMP WITH TIME ZONE NOT NULL,
    details_status TEXT DEFAULT 'PROCESSING' NOT NULL,
    details_word_count INTEGER NOT NULL,
    creator_id INTEGER NOT NULL,
    process_time FLOAT NOT NULL DEFAULT 0,
    input_document_id INTEGER NOT NULL,
    output_document_id INTEGER NOT NULL,
    organization_id INTEGER,
    CONSTRAINT fk_creator_id FOREIGN KEY (creator_id) REFERENCES "User"(id) ON DELETE CASCADE,
    CONSTRAINT fk_input_document_id FOREIGN KEY (input_document_id) REFERENCES Document(id) ON DELETE CASCADE,
    CONSTRAINT fk_output_document_id FOREIGN KEY (output_document_id) REFERENCES Document(id) ON DELETE CASCADE,
    CONSTRAINT fk_organization_id FOREIGN KEY (organization_id) REFERENCES Organization(id) ON DELETE SET NULL
    );
    """

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
    feedbacks = db.relationship(
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


@event.listens_for(Translation, 'before_delete')
def delete_related_feedbacks(mapper, connection, target):
    for feedback in target.feedbacks:
        db.session.delete(feedback)
        db.session.flush()