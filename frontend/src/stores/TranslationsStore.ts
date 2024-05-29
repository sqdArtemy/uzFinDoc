import { makeAutoObservable } from 'mobx';
import { AxiosError, AxiosResponse } from 'axios';
import { ITranslationResponse } from '../api/interfaces/responses/translation.ts';
import { organizationService } from '../api/services/organizationService.ts';
import { translationService } from '../api/services/translationService.ts';

class TranslationsStore {
    state: 'pending' | 'loading' | 'success' | 'error' = 'pending';
    errorMessage: string = '';
    storeData: ITranslationResponse[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    set data(data: ITranslationResponse[]) {
        this.storeData = data;
    }

    set currentState(state: 'pending' | 'loading' | 'success' | 'error') {
        this.state = state;
    }

    get data() {
        console.log(localStorage.getItem('blacklist'));
        return this.storeData.filter((item) => {
            return !localStorage
                .getItem('blacklist')
                ?.split(',')
                .includes(item.id.toString());
        });
    }

    getOrganizationTranslations(organizationId: number) {
        this.currentState = 'loading';
        organizationService
            .getTranslations(organizationId)
            .then(
                this.getOrganizationTranslationsSuccess,
                this.getOrganizationTranslationsFailure
            );
    }

    getOrganizationTranslationsSuccess = ({
        data,
    }: AxiosResponse<ITranslationResponse[]>) => {
        this.currentState = 'success';
        this.data = data;
        console.log(data);
    };

    getOrganizationTranslationsFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMessage = response?.data || 'Something went wrong';
    };

    getTranslations() {
        this.currentState = 'loading';
        translationService
            .getTranslations()
            .then(this.getTranslationsSuccess, this.getTranslationsFailure);
    }

    getTranslationsSuccess = ({
        data,
    }: AxiosResponse<ITranslationResponse[]>) => {
        this.currentState = 'success';
        this.data = data;
    };

    getTranslationsFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMessage = response?.data || 'Something went wrong';
    };

    filterByDate(startDate: string, endDate: string) {
        this.data = this.storeData.filter((item) => {
            const date = new Date(item.generatedAt);
            return date >= new Date(startDate) && date <= new Date(endDate);
        });
    }
}

const translationsStore = new TranslationsStore();
export default translationsStore;
