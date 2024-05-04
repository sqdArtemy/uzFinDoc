from marshmallow import EXCLUDE, fields, validates, ValidationError, pre_load

from models import Feedback, Translation
from utilities.enums import Messages
from utilities.exceptions import PermissionDeniedError
from app_init import ma
from db_init import db


class FeedbackGetSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Feedback
        fields = ("id", "rating", "review", "creator", "translation")
        load_instance = True
        ordered = True

    creator = fields.Nested(
        "schemas.user.UserGetSchema",
        exclude=["organization"],
        data_key="creator"
    )
    translation = fields.Nested(
        "schemas.translation.TranslationGetSchema",
        exclude=["feedback", "creator"],
        data_key="translation"
    )


class FeedbackCreateSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Feedback
        fields = ("rating", "review", "translation_id", "creator_id")
        load_instance = True
        unknown = EXCLUDE
        sqla_session = db.session

    rating = fields.Integer(required=True)
    review = fields.Str(require=True)
    translation_id = fields.Integer(required=True)
    creator_id = fields.Integer(required=True)

    @validates("rating")
    def validate_rating(self, value: str) -> None:
        if not (0 <= int(value) <= 5):
            raise ValidationError(Messages.VALUE_RANGE.value.format(0, 5))

    @pre_load
    def validate_creator_and_translation(self, data, **kwargs) -> dict:
        creator_id = data.get("creator_id", None)
        translation_id = data.get("translation_id", None)

        if not creator_id:
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("User", "id", creator_id))

        translation = Translation.query.filter_by(id=translation_id).first()

        if not translation_id or not translation:
            raise ValidationError(Messages.OBJECT_NOT_FOUND.value.format("Translation", "id", translation_id))

        if translation.feedback:
            raise ValidationError(Messages.ALREADY_REVIEWED.value)

        if translation.creator_id != creator_id:
            raise PermissionDeniedError(Messages.USER_NOT_TRANSLATION_CREATOR.value)

        return data
