from db_init import db


class Feedback(db.Model):
    __tablename__ = "Feedback"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    rating = db.Column(db.Integer, nullable=False)
    review = db.Column(db.String(255))

    __table_args__ = (
        db.CheckConstraint("rating >= 0 AND rating <= 5", name="check_feedback_rating"),
    )

    def __repr__(self) -> str:
        return f"{self.rating} - {self.review}"
