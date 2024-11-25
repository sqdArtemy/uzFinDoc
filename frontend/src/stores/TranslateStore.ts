import { makeAutoObservable } from 'mobx';
import { AxiosError, AxiosResponse } from 'axios';
import { translationService } from '../api/services/translationService.ts';
import { ITranslationResponse } from '../api/interfaces/responses/translation.ts';

class TranslateStore {
    state: 'pending' | 'loading' | 'success' | 'error' = 'pending';
    errorMessage: string = '';
    _translationData: ITranslationResponse = {} as ITranslationResponse;
    _documentData: string | ArrayBuffer | null = '';

    constructor() {
        makeAutoObservable(this);
    }

    set translationData(data: ITranslationResponse) {
        this._translationData = data;
    }

    set documentData(data: string | ArrayBuffer | null) {
        this._documentData = data;
    }

    set currentState(state: 'pending' | 'loading' | 'success' | 'error') {
        this.state = state;
    }

    translate(
        outputFormat: 'docx' | 'pdf',
        file: File,
        isOrganizational: boolean
    ) {
        this.currentState = 'loading';

        translationService
            .translateDocument(outputFormat, file, isOrganizational)
            .then(this.translateSuccess, this.translateFailure);
    }

    translateSuccess = ({ data }: AxiosResponse<ITranslationResponse>) => {
        this.translationData = data;
        this.previewDocument(data.outputDocument.id);
    };

    translateFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMessage = response?.data || 'Something went wrong';
    };

    previewDocument(documentId: number) {
        this.currentState = 'loading';
        translationService
            .downloadDocument(documentId)
            .then(this.previewDocumentSuccess, this.previewDocumentFailure);
    }

    previewDocumentSuccess = ({ data }: AxiosResponse<string>) => {
        console.log(data);
        const blob = new Blob([data], { type: 'application/octet-stream' });
        console.log(blob);
        let resultData = '';
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onloadend = () => {
            this.documentData = reader.result;
            resultData = (this._documentData as string).substring(
                (this._documentData as string).indexOf(',') + 1
            );
            this.documentData = resultData;
            this.currentState = 'success';
        };
    };

    previewDocumentFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMessage = response?.data || 'Something went wrong';
    };

    downloadDocument(documentId: number, fileName: string) {
        this.currentState = 'loading';
        translationService
            .downloadDocument(documentId)
            .then(
                (response) => this.downloadDocumentSuccess(response, fileName),
                this.downloadDocumentFailure
            );
    }

    downloadDocumentSuccess = (
        { data }: AxiosResponse<string>,
        fileName: string
    ) => {
        const blob = new Blob([data], { type: 'application/octet-stream' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        a.click();
        window.URL.revokeObjectURL(url);
        this.currentState = 'success';
    };

    downloadDocumentFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMessage = response?.data || 'Something went wrong';
    };

    reset() {
        this.state = 'pending';
        this.errorMessage = '';
        this._translationData = {} as ITranslationResponse;
        // this._documentData = '';
    }

    deleteTranslation(documentId: number) {
        let blacklist = localStorage.getItem('blacklist')?.split(',');
        if (!blacklist) blacklist = [];
        if (!blacklist?.includes(documentId.toString()))
            blacklist?.push(documentId.toString());
        localStorage.setItem('blacklist', blacklist.join(','));
    }
}

const translateStore = new TranslateStore();
export default translateStore;
