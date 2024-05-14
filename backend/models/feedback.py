from db_init import db


class Feedback(db.Model):
    __tablename__ = "Feedback"

    """
    CREATE TABLE Feedback (
    rating INTEGER NOT NULL,
    review VARCHAR(255),
    translation_id INTEGER NOT NULL,
    creator_id INTEGER NOT NULL,
    PRIMARY KEY (translation_id, creator_id),
    CONSTRAINT fk_translation_id FOREIGN KEY (translation_id) REFERENCES Translation(id) ON DELETE CASCADE,
    CONSTRAINT fk_creator_id FOREIGN KEY (creator_id) REFERENCES User(id) ON DELETE CASCADE,
    CONSTRAINT check_feedback_rating CHECK (rating >= 0 AND rating <= 5)
    );
    """

    rating = db.Column(db.Integer, nullable=False)
    review = db.Column(db.String(255))
    translation_id = db.Column(db.Integer, db.ForeignKey("Translation.id", ondelete="CASCADE"), primary_key=True)
    creator_id = db.Column(db.Integer, db.ForeignKey("User.id", ondelete="CASCADE"), primary_key=True)

    __table_args__ = (
        db.CheckConstraint("rating >= 0 AND rating <= 5", name="check_feedback_rating"),
    )

    creator = db.relationship(
        "User",
        backref="feedbacks",
        lazy="joined",
        primaryjoin="User.id == Feedback.creator_id"
    )

    def __repr__(self) -> str:
        return f"{self.rating} - {self.review}"
