import { makeAutoObservable } from 'mobx';
import { authService } from '../api/services/authService.ts';
import { userService } from '../api/services/userService.ts';
import { ILoginResponse } from '../api/interfaces/responses/auth.ts';
import { AxiosError, AxiosResponse } from 'axios';
import { IGetUserResponse } from '../api/interfaces/responses/users.ts';
import { IUpdateUserRequest } from '../api/interfaces/requests/users.ts';
import { IRegisterRequest } from '../api/interfaces/requests/auth.ts';
import { organizationService } from '../api/services/organizationService.ts';
import { IOrganizationResponse } from '../api/interfaces/responses/organization.ts';
import { ICreateOrganization } from '../api/interfaces/requests/organization.ts';

type CurrentUserData = ILoginResponse['user'] & { password: string } & {
    organization: null | {
        owner?: IGetUserResponse;
    };
};

class UserStore {
    storeData: CurrentUserData = {} as CurrentUserData;
    state: 'pending' | 'loading' | 'success' | 'error' = 'pending';
    errorMessage: string = '';

    constructor() {
        makeAutoObservable(this);
    }

    set currentState(state: 'pending' | 'loading' | 'success' | 'error') {
        this.state = state;
    }

    get data(): CurrentUserData {
        if (
            isNaN(this.storeData.id) ||
            isNaN(this.storeData.organization!.id)
        ) {
            this.fetchCurrentUser();
        }
        return this.storeData;
    }

    set data(data: CurrentUserData) {
        this.storeData = data;
    }

    set errorMsg(error: string) {
        console.log(error[0]);
        if (error[0] === '{') {
            error = 'Something went wrong.';
        }
        this.errorMessage = error;
    }

    get errorMsg() {
        return this.errorMessage;
    }

    createOrganization(data: ICreateOrganization) {
        this.currentState = 'loading';
        organizationService
            .createOrganization(data)
            .then(
                this.createOrganizationSuccess,
                this.createOrganizationFailure
            );
    }

    getOrganization(organizationId: number) {
        this.currentState = 'loading';
        organizationService
            .getOrganization(organizationId)
            .then(this.getOrganizationSuccess, this.getOrganizationFailure);
    }

    getOrganizationSuccess = ({
        data,
    }: AxiosResponse<IOrganizationResponse>) => {
        this.data = { ...this.storeData, organization: data };
        this.currentState = 'success';
    };

    getOrganizationFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        console.log(response);
        this.errorMsg = response?.data || 'Something went wrong';
    };

    createOrganizationSuccess = ({
        data,
    }: AxiosResponse<IOrganizationResponse>) => {
        this.data = { ...this.storeData, organization: data };
        this.currentState = 'success';
    };

    createOrganizationFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMsg = response?.data || 'Something went wrong';
    };

    updateOrganization(data: ICreateOrganization) {
        this.currentState = 'loading';
        organizationService
            .updateOrganization(data, this.data.organization!.id)
            .then(
                this.updateOrganizationSuccess,
                this.updateOrganizationFailure
            );
    }

    updateOrganizationSuccess = ({
        data,
    }: AxiosResponse<IOrganizationResponse>) => {
        this.data = { ...this.data, organization: data };
        this.currentState = 'success';
        console.log(this.data, this.state);
    };

    updateOrganizationFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMsg = response?.data || 'Something went wrong';
        console.log(this.data, this.currentState);
    };

    fetchCurrentUser() {
        this.currentState = 'loading';
        userService
            .getCurrentUser()
            .then(this.fetchCurrentUserSuccess, this.fetchCurrentUserFailure);
    }

    fetchCurrentUserSuccess = ({ data }: AxiosResponse<IGetUserResponse>) => {
        if (!data.organization) {
            this.currentState = 'success';
            this.data = { ...this.storeData, ...data };
            return;
        }
        this.data = { ...this.storeData, ...data };
        this.getOrganization(data.organization.id);
    };

    fetchCurrentUserFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMsg = response?.data || 'Something went wrong';
    };

    login(email: string, password: string) {
        this.currentState = 'loading';
        this.data.password = password;
        authService
            .login({ email, password })
            .then(this.loginSuccess, this.loginFailure);
    }

    loginSuccess = ({ data }: AxiosResponse<ILoginResponse>) => {
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        // this.fetchCurrentUser();
        this.data = {
            ...this.storeData,
            ...data.user,
        };
        this.currentState = 'success';
    };

    loginFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMsg = response?.data || 'Something went wrong';
    };

    logout() {
        this.currentState = 'loading';
        authService.logOut().then(this.logoutSuccess, this.logoutFailure);
    }

    logoutSuccess = () => {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.data = {} as CurrentUserData;
        this.currentState = 'success';
    };

    logoutFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMsg = response?.data || 'Something went wrong';
    };

    updateUser(id: number, data: IUpdateUserRequest) {
        this.currentState = 'loading';
        userService
            .updateUser(id, data)
            .then(this.updateUserSuccess, this.updateUserFailure);
    }

    updateUserSuccess = ({ data }: AxiosResponse<IUpdateUserRequest>) => {
        this.data = { ...this.storeData, ...data };
        this.currentState = 'success';
    };

    updateUserFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMsg = response?.data || 'Something went wrong';
    };

    deleteUser(id: number) {
        this.currentState = 'loading';
        userService
            .deleteUser(id)
            .then(this.deleteUserSuccess, this.deleteUserFailure);
    }

    deleteUserSuccess = () => {
        this.data = {} as CurrentUserData;
        this.state = 'success';
    };

    deleteUserFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMsg = response?.data || 'Something went wrong';
    };

    register(data: IRegisterRequest) {
        this.currentState = 'loading';
        authService
            .register(data)
            .then(this.registerSuccess, this.registerFailure);
    }

    registerSuccess = ({ data }: AxiosResponse<ILoginResponse>) => {
        this.data = { ...this.storeData, ...data };
        this.login(this.data.email, this.data.password);
    };

    registerFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMsg = response?.data || 'Something went wrong';
    };
}

const userStore = new UserStore();
export default userStore;
