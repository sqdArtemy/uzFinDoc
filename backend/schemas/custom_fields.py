from marshmallow import fields


class LanguageField(fields.Field):
    """
    Field for handling Language codes
    """
    def _serialize(self, value, attr, obj, **kwargs):
        return str(value.value)

    def _deserialize(self, value, attr, data, **kwargs):
        return value


class DocumentTypeField(fields.Field):
    """
    Field for handling DocumentType`s codes
    """
    def _serialize(self, value, attr, obj, **kwargs):
        return str(value.value)

    def _deserialize(self, value, attr, data, **kwargs):
        return value


class TranslationStatusField(fields.Field):
    """
    Field for handling TranslationStatus`s codes
    """
    def _serialize(self, value, attr, obj, **kwargs):
        return str(value.value)

    def _deserialize(self, value, attr, data, **kwargs):
        return value
