from db_init import db


class Feedback(db.Model):
    __tablename__ = "Feedback"

    rating = db.Column(db.Integer, nullable=False)
    review = db.Column(db.String(255))
    translation_id = db.Column(db.Integer, db.ForeignKey("Translation.id"), nullable=False, primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey("User.id"), nullable=False, primary_key=True)

    __table_args__ = (
        db.CheckConstraint("rating >= 0 AND rating <= 5", name="check_feedback_rating"),
    )

    def __repr__(self) -> str:
        return f"{self.rating} - {self.review}"
