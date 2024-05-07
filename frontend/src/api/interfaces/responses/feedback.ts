import { IGetUserResponse } from "./users.ts";
import { ITranslationResponse } from "./translation.ts";

export interface IGetFeedbackResponse {
    "rating": number;
    "review": string;
    "creator": IGetUserResponse;
}

export interface ICreateFeedbackResponse {
    "rating": number;
    "review": string;
    "creator": IGetUserResponse;
    "translation": ITranslationResponse;
}