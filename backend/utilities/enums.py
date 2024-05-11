"""
This file contains all needed enumerators for this project
"""
from enum import Enum


class Messages(Enum):
    # Valued validation
    VALUE_RANGE = "Value should be in range from {} to {}"
    VALUE_POSITIVE = "Value should be > 0."
    INVALID_FILTERS = "Provided filters are invalid."
    INVALID_SORT = "Provided sorting fields are invalid"

    # Object actions
    OBJECT_NOT_FOUND = "{} with {} '{}' does not exist."
    OBJECT_DELETED = "{} has been deleted."
    OBJECT_ALREADY_EXISTS = "{} with {} '{}' already exists."

    # Auth actions
    FORBIDDEN = "You do not have permission to perform this action."
    INVALID_CREDENTIALS = "Invalid credentials."
    TOKEN_EXPIRED = "Token is expired."
    TOKEN_MISSING = "Missing token."

    # Organization members
    USER_ALREADY_HAVE_ORG = "User with {} '{}' already have organization."
    USER_HAS_NO_ACCESS_TO_ORG = "User with {} '{}' does not have access to that organization."
    USER_NOT_OWNER = "User is not an owner of this organization."
    USER_HAS_NO_ORG = "User does not have organization."
    USER_NOT_A_MEMBER = "User is not a member of this organization."
    OWNER_CANNOT_LEAVE_ORG = "Owner cannot leave this organization, he can delete it instead."

    # Translation validation
    ALREADY_REVIEWED = "This translation already has a feedback."
    USER_NOT_TRANSLATION_CREATOR = "User is not a creator of this translation."

    # Document validation
    USER_NOT_UPLOADED_THIS_DOCUMENT = "User is not uploaded this document."
    DOCUMENT_HAS_NO_TRANSLATIONS = "Document has no translations."
    USER_CANNOT_SEE_THIS_DOCUMENT = " User cannot see this document."


class DocumentFormats(Enum):
    DOCX = "docx"
    PDF = "pdf"
    DOCX_CODE = "vnd.openxmlformats-officedocument.wordprocessingml.document"
    SUPPORTED_FORMATS = "Application currently supports only .pfd and .docx files!"
    AVAILABLE_FORMATS = [PDF, DOCX]
