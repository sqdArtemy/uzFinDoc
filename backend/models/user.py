from db_init import db


class User(db.Model):
    __tablename__ = "User"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name_first_name = db.Column(db.String(50), nullable=False)
    name_middle_name = db.Column(db.String(50), nullable=False)
    name_last_name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)

    def __repr__(self) -> str:
        return f"{self.email}"
