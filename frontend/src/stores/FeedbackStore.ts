import { makeAutoObservable } from 'mobx';
import { ICreateFeedbackResponse } from '../api/interfaces/responses/feedback.ts';
import {
    Rating,
    translationService,
} from '../api/services/translationService.ts';
import { AxiosError, AxiosResponse } from 'axios';

class FeedbackStore {
    state: 'pending' | 'loading' | 'success' | 'error' = 'pending';
    errorMessage: string = '';
    storeData: ICreateFeedbackResponse = {} as ICreateFeedbackResponse;

    constructor() {
        makeAutoObservable(this);
    }

    set currentState(state: 'pending' | 'loading' | 'success' | 'error') {
        this.state = state;
    }

    set data(data: ICreateFeedbackResponse) {
        this.storeData = data;
    }

    set errorMsg(error: string) {
        console.log(error[0]);
        if (error.includes('already has a feedback')) {
            error = 'You have already given feedback for this translation.';
            this.errorMessage = error;
            return;
        } else if (error[0] === '{') {
            error = 'Something went wrong.';
        }
        this.errorMessage = error;
    }

    get errorMsg() {
        return this.errorMessage;
    }

    createFeedback(rating: Rating, review: string, translationId: number) {
        this.currentState = 'loading';
        translationService
            .addFeedback(rating, review, translationId)
            .then(this.createFeedbackSuccess, this.createFeedbackFailure);
    }

    createFeedbackSuccess = ({
        data,
    }: AxiosResponse<ICreateFeedbackResponse>) => {
        this.data = data;
        this.currentState = 'success';
    };

    createFeedbackFailure = ({ response }: AxiosError<string>) => {
        this.errorMsg = response?.data || 'Something went wrong';
        this.currentState = 'error';
    };
}

const feedbackStore = new FeedbackStore();
export default feedbackStore;
