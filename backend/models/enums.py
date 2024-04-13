from enum import Enum


class DocumentType(Enum):
    OUTPUT_FILE = "OutputFile"
    INPUT_FILE = "InputFile"


class Language(Enum):
    UZ = "Uzbek"
    ENG = "English"


class TranslationStatus(Enum):
    PROCESSING = "Processing"
    DONE = "Done"
    FAILED = "Failed"
