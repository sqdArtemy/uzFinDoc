from db_init import db
from sqlalchemy.dialects.postgresql import ENUM

from .enums import Language

"""
CREATE TABLE WordSense (
    word_id VARCHAR(255),
    sense_id VARCHAR(100),
    FOREIGN KEY (word_id) REFERENCES Word(id),
    FOREIGN KEY (sense_id) REFERENCES Sense(id),
    PRIMARY KEY (word_id, sense_id)
);
"""


word_sense = db.Table(
    "WordSense",
    db.Column("word_id", db.String(255), db.ForeignKey("Word.id")),
    db.Column("sense_id", db.String(100), db.ForeignKey("Sense.id"))
)


class Word(db.Model):
    __tablename__ = 'Word'

    """
    CREATE TABLE Word (
    id VARCHAR(255) PRIMARY KEY,
    written_form VARCHAR(255) NOT NULL,
    part_of_speech VARCHAR(50) NOT NULL,
    language VARCHAR NOT NULL
    );
    """

    id = db.Column(db.String(255), primary_key=True)
    written_form = db.Column(db.String(255), nullable=False)
    part_of_speech = db.Column(db.String(50), nullable=False)
    language = db.Column(ENUM(Language, create_type=False), nullable=False)

    def __repr__(self) -> str:
        return f"{self.id} - {self.written_form} - {self.part_of_speech}"

    senses = db.relationship(
        "Sense", secondary=word_sense, backref="words", lazy="joined"
    )
