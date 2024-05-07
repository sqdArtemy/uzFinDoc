import { makeAutoObservable } from 'mobx';
import { authService } from '../api/services/authService.ts';
import { userService } from '../api/services/userService.ts';
import { ILoginResponse } from '../api/interfaces/responses/auth.ts';
import { AxiosError, AxiosResponse } from 'axios';
import { IGetUserResponse } from '../api/interfaces/responses/users.ts';
import { IUpdateUserRequest } from '../api/interfaces/requests/users.ts';
import { IRegisterRequest } from '../api/interfaces/requests/auth.ts';

type CurrentUserData = IGetUserResponse & { password: string };

class AuthStore {
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
        if (isNaN(this.storeData.id)) {
            this.fetchCurrentUser();
        }
        return this.storeData;
    }

    set data(data: CurrentUserData) {
        this.storeData = data;
    }

    fetchCurrentUser() {
        this.currentState = 'loading';
        userService
            .getCurrentUser()
            .then(this.fetchCurrentUserSuccess, this.fetchCurrentUserFailure);
    }

    fetchCurrentUserSuccess = ({ data }: AxiosResponse<IGetUserResponse>) => {
        this.currentState = 'success';
        this.data = { ...this.storeData, ...data };
    };

    fetchCurrentUserFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMessage = response?.data || 'Something went wrong';
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
        this.fetchCurrentUser();
    };

    loginFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMessage = response?.data || 'Something went wrong';
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
        this.errorMessage = response?.data || 'Something went wrong';
    };

    updateUser(data: IUpdateUserRequest) {
        this.currentState = 'loading';
        userService
            .updateUser(this.storeData.id, data)
            .then(this.updateUserSuccess, this.updateUserFailure);
    }

    updateUserSuccess = ({ data }: AxiosResponse<IUpdateUserRequest>) => {
        this.data = { ...this.storeData, ...data };
        this.currentState = 'success';
    };

    updateUserFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMessage = response?.data || 'Something went wrong';
    };

    deleteUser() {
        this.currentState = 'loading';
        userService
            .deleteUser(this.storeData.id)
            .then(this.deleteUserSuccess, this.deleteUserFailure);
    }

    deleteUserSuccess = () => {
        this.data = {} as CurrentUserData;
        this.state = 'success';
    };

    deleteUserFailure = ({ response }: AxiosError<string>) => {
        this.currentState = 'error';
        this.errorMessage = response?.data || 'Something went wrong';
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
        this.errorMessage = response?.data || 'Something went wrong';
    };
}

const authStore = new AuthStore();
export default authStore;
