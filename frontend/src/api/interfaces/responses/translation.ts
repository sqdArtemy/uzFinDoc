import { IGetUserResponse } from "./users.ts";
import { IOrganizationResponse } from "./organization.ts";

export interface ITranslationResponse {
    "id": number;
    "language": string;
    "generatedAt": string | Date;
    "detailsStatus": string;
    "details_word_count": number;
    "creator": IGetUserResponse,
    "input_document": IDocumentResponse;
    "output_document": IDocumentResponse;
    "organization": IOrganizationResponse;
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