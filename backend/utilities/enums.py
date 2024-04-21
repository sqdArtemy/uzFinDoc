from enum import Enum


class Messages(Enum):
    OBJECT_NOT_FOUND = "Object with {} '{}' does not exist."
    OBJECT_DELETED = "Object has been deleted."
    FORBIDDEN = "You do not have permission to perform this action."
