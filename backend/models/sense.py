from db_init import db


class Sense(db.Model):
    __tablename__ = "Sense"

    id = db.Column(db.String(100), primary_key=True)
    synset_ref = db.Column(db.String(100), nullable=False)

    def __repr__(self) -> str:
        return f"{self.id} - {self.synset_ref}"
