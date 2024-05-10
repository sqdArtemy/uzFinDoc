import { IGetUserResponse } from './users.ts';
import { ITranslationResponse } from './translation.ts';

export interface IGetFeedbackResponse {
    rating: 0 | 1 | 2 | 3 | 4 | 5;
    review: string;
    creator: IGetUserResponse;
}

export interface ICreateFeedbackResponse {
    rating: number;
    review: string;
    creator: IGetUserResponse;
    translation: ITranslationResponse;
}
