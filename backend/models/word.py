from db_init import db
from sqlalchemy.dialects.postgresql import ENUM

from .enums import Language


word_sense = db.Table(
    "WordSense",
    db.Column("word_id", db.String(255), db.ForeignKey("Word.id")),
    db.Column("sense_id", db.String(100), db.ForeignKey("Sense.id"))
)


class Word(db.Model):
    __tablename__ = 'Word'

    id = db.Column(db.String(255), primary_key=True)
    written_form = db.Column(db.String(50), nullable=False)
    part_of_speech = db.Column(db.String(10), nullable=False)
    language = db.Column(ENUM(Language, create_type=False), nullable=False)

    def __repr__(self) -> str:
        return f"{self.id} - {self.written_form} - {self.part_of_speech}"
