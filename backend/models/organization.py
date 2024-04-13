from db_init import db


class Organization(db.Model):
    __tablename__ = 'Organization'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), unique=True, nullable=False)

    def __repr__(self) -> str:
        return f"{self.name}"
