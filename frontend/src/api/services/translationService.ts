import { ITranslationResponse } from "../interfaces/responses/translation.ts";
import { axiosInstance } from "../axiosInstance.ts";


export class TranslationService {
    public translateDocument = async (outputFormat: "docx" | "pdf", language: "uz" | "en", file: File) => {
        const url = '/translation'
        const formData = new FormData();
        formData.append('input_file', file);
        formData.append('output_format', outputFormat);
        formData.append('language', language);

        return axiosInstance.post<ITranslationResponse>(url, formData)
    }

    public downloadDocument = async (id: number) => {
        const url = `/document/${id}/download`;
        return axiosInstance.get<Blob>(url, {
            headers: {
                responseType: 'arraybuffer'
            }
        });
    }
}

export const translationService = new TranslationService();