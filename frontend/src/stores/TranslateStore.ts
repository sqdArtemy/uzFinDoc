import { makeAutoObservable } from 'mobx';
import { AxiosError, AxiosResponse } from 'axios';
import { translationService } from '../api/services/translationService.ts';
import { ITranslationResponse } from '../api/interfaces/responses/translation.ts';

class TranslateStore {
    state: 'pending' | 'loading' | 'success' | 'error' = 'pending';
    errorMessage: string = '';
    storeData: ITranslationResponse = {} as ITranslationResponse;

    constructor() {
        makeAutoObservable(this);
    }

    set data(data: ITranslationResponse) {
        this.storeData = data;
    }

    set currentState(state: 'pending' | 'loading' | 'success' | 'error') {
        this.state = state;
    }

    translate(outputFormat: 'docx' | 'pdf', file: File) {
        this.currentState = 'loading';
        console.log('Translate', outputFormat, file);
        translationService
            .translateDocument(outputFormat, file)
            .then(this.translateSuccess, this.translateFailure);
    }

    translateSuccess = ({ data }: AxiosResponse<ITranslationResponse>) => {
        this.currentState = 'success';
        this.data = data;
    };

    translateFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMessage = response?.data || 'Something went wrong';
    };
}

const translateStore = new TranslateStore();
export default translateStore;
