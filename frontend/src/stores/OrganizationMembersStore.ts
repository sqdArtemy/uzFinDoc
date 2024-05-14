import { makeAutoObservable } from 'mobx';
import { AxiosError, AxiosResponse } from 'axios';
import { IGetUserResponse } from '../api/interfaces/responses/users.ts';
import { organizationService } from '../api/services/organizationService.ts';

class OrganizationMembersStore {
    state: 'pending' | 'loading' | 'success' | 'error' = 'pending';
    errorMessage: string = '';
    storeData: IGetUserResponse[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    set data(data: IGetUserResponse[]) {
        this.storeData = data;
    }

    set currentState(state: 'pending' | 'loading' | 'success' | 'error') {
        this.state = state;
    }

    get data() {
        return this.storeData;
    }

    getAllMembers(organizationId: number) {
        this.currentState = 'loading';
        organizationService
            .getAllMembers(organizationId)
            .then(this.getAllMembersSuccess, this.getAllMembersFailure);
    }

    getAllMembersSuccess = ({ data }: AxiosResponse<IGetUserResponse[]>) => {
        this.currentState = 'success';
        this.data = data;
    };

    getAllMembersFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMessage = response?.data || 'Something went wrong';
    };

    addMember(organizationId: number, email: string) {
        this.currentState = 'loading';
        organizationService
            .addMember(organizationId, email)
            .then(this.addMemberSuccess, this.addMemberFailure);
    }

    addMemberSuccess = ({ data }: AxiosResponse<IGetUserResponse[]>) => {
        this.currentState = 'success';
        this.data = data;
    };

    addMemberFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMessage = response?.data || 'Something went wrong';
    };

    deleteMember(organizationId: number, email: string) {
        this.currentState = 'loading';
        organizationService
            .deleteMember(organizationId, email)
            .then(this.deleteMemberSuccess, this.deleteMemberFailure);
    }

    deleteMemberSuccess = ({ data }: AxiosResponse<IGetUserResponse[]>) => {
        this.currentState = 'success';
        this.data = data;
    };

    deleteMemberFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMessage = response?.data || 'Something went wrong';
    };
}

const organizationMembersStore = new OrganizationMembersStore();
export default organizationMembersStore;
