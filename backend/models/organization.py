from datetime import datetime, timezone

from db_init import db


class Organization(db.Model):
    __tablename__ = 'Organization'

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    name = db.Column(db.String(80), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, nullable=False, default=datetime.now(timezone.utc).isoformat())
    email = db.Column(db.String(100), unique=True, nullable=False)
    owner_id = db.Column(db.Integer, db.ForeignKey('User.id', ondelete="CASCADE"), nullable=False)

    def __repr__(self) -> str:
        return f"{self.name}"

    owner = db.relationship(
        "User",
        backref="owned_organization",
        lazy="joined",
        primaryjoin="User.id == Organization.owner_id"
    )
