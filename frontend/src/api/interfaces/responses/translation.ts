import { IGetUserResponse } from "./users.ts";
import { IOrganizationResponse } from "./organization.ts";
import {IGetFeedbackResponse} from "./feedback.ts";

export interface ITranslationResponse {
    "id": number;
    "language": string;
    "generatedAt": string | Date;
    "detailsStatus": string;
    "detailsWordCount": number;
    "creator": IGetUserResponse,
    "inputDocument": IDocumentResponse;
    "outputDocument": IDocumentResponse;
    "organization": IOrganizationResponse | null;
    "feedback"?: IGetFeedbackResponse | null, // feedback is returned in POST methods
    "process_time": number;
}

export interface IDocumentResponse {
    "id": number;
    "name": string;
    "format": string;
    "text": string;
    "uploadedAt": string | Date;
    "link": string;
    "type": string;
    "language": string;
}

export interface IUnknownWordResponse {
    "written_form": string,
    "reporter_id": number,
    "document_id": number,
    "possible_translation": string;
}