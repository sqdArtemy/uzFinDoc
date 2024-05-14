import { makeAutoObservable } from 'mobx';
import { ITranslationResponse } from '../api/interfaces/responses/translation.ts';
import { translationService } from '../api/services/translationService.ts';
import { AxiosError, AxiosResponse } from 'axios';

class TranslationStore {
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

    get data() {
        return this.storeData;
    }

    getTranslationById(translationId: number) {
        this.currentState = 'loading';
        translationService
            .getTranslationById(translationId)
            .then(
                this.getTranslationByIdSuccess,
                this.getTranslationByIdFailure
            );
    }

    getTranslationByIdSuccess = ({
        data,
    }: AxiosResponse<ITranslationResponse>) => {
        this.currentState = 'success';
        console.log(data);
        this.data = data;
    };

    getTranslationByIdFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMessage = response?.data || 'Something went wrong';
    };
}

const translationStore = new TranslationStore();
export default translationStore;
