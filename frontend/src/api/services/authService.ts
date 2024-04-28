import {
    ILoginRequest,
    IRegisterRequest,
} from '../interfaces/requests/auth.ts';
import { IGetUserResponse } from '../interfaces/responses/users.ts';
import { axiosInstance } from '../axiosInstance.ts';
import {
    ILoginResponse,
    ILogoutResponse,
} from '../interfaces/responses/auth.ts';

export class AuthService {
    public register = async (data: IRegisterRequest) => {
        const url = '/user/register';
        return axiosInstance.post<IGetUserResponse>(url, data);
    };

    public login = async (data: ILoginRequest) => {
        const url = '/user/login';
        console.log(data);
        return axiosInstance.post<ILoginResponse>(url, data);
    };

    public logOut = async (): Promise<ILogoutResponse> => {
        const url = '/user/logout';
        const response = await axiosInstance.get(url);

        return response.data as ILogoutResponse;
    };
}

export const authService = new AuthService();
