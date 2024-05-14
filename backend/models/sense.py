from db_init import db


class Sense(db.Model):
    __tablename__ = "Sense"

    """
    CREATE TABLE Sense (
    id VARCHAR(100) PRIMARY KEY,
    synset_ref VARCHAR(100) NOT NULL
    );
    """

    id = db.Column(db.String(100), primary_key=True)
    synset_ref = db.Column(db.String(100), nullable=False)

    def __repr__(self) -> str:
        return f"{self.id} - {self.synset_ref}"
