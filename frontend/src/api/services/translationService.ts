import {
    ITranslationResponse,
    IUnknownWordResponse,
} from '../interfaces/responses/translation.ts';
import { axiosInstance } from '../axiosInstance.ts';
import { ICreateFeedbackResponse } from '../interfaces/responses/feedback.ts';
// import FormData from 'form-data';
export type Rating = 0 | 1 | 2 | 3 | 4 | 5;

export class TranslationService {
    public translateDocument = async (
        outputFormat: 'docx' | 'pdf',
        file: File
    ) => {
        const url = '/translations';
        const formData = new FormData();
        formData.append('output_format', outputFormat);
        formData.append('input_document', file);
        formData.append('language', 'uz');

        return axiosInstance.post<ITranslationResponse>(url, formData);
    };

    public downloadDocument = async (documentId: number) => {
        const url = `/document/${documentId}/download`;
        return axiosInstance.get<string>(url, {
            headers: {
                responseType: 'arraybuffer',
            },
        });
    };

    public getTranslations = async () => {
        const url = '/translations';
        return axiosInstance.get<ITranslationResponse[]>(url);
    };

    public getTranslationById = async (translationId: number) => {
        const url = '/translation/' + translationId;
        return axiosInstance.get<ITranslationResponse>(url);
    };

    public addFeedback = async (
        rating: Rating,
        review: string,
        translationId: number
    ) => {
        const url = `/translation/${translationId}/feedbacks`;
        const data = { rating, review };
        return axiosInstance.post<ICreateFeedbackResponse>(url, data);
    };

    public addUnknownWord = async (
        writtenForm: string,
        possibleTranslation: string,
        translationId: number
    ) => {
        const url = `/translation/${translationId}/unknown_word`;
        const data = { writtenForm, possibleTranslation };
        return axiosInstance.post<IUnknownWordResponse>(url, data);
    };
}

export const translationService = new TranslationService();
