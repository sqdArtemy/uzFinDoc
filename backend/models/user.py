from db_init import db


class User(db.Model):
    __tablename__ = "User"

    """
    CREATE TABLE "User" (
    id SERIAL PRIMARY KEY,
    name_first_name VARCHAR(50) NOT NULL,
    name_middle_name VARCHAR(50) NOT NULL,
    name_last_name VARCHAR(50) NOT NULL,
    phone VARCHAR(20) UNIQUE NOT NULL,
    email VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    organization_id INTEGER,
    CONSTRAINT fk_organization_id FOREIGN KEY (organization_id) REFERENCES Organization(id) ON DELETE SET NULL
    );
    """

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name_first_name = db.Column(db.String(50), nullable=False)
    name_middle_name = db.Column(db.String(50), nullable=False)
    name_last_name = db.Column(db.String(50), nullable=False)
    phone = db.Column(db.String(20), unique=True, nullable=False)
    email = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(255), nullable=False)
    organization_id = db.Column(db.Integer, db.ForeignKey('Organization.id', ondelete='SET NULL'), nullable=True)

    def __repr__(self) -> str:
        return f"{self.email}"

    organization = db.relationship(
        "Organization",
        backref="users",
        lazy="joined",
        cascade="all, delete",
        primaryjoin="User.organization_id == Organization.id"
    )
