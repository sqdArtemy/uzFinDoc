import { ILoginRequest, IRegisterRequest } from "./interfaces/requests/auth.ts";
import { IGetUserResponse } from "./interfaces/responses/users.ts";
import { axiosInstance } from "./axiosInstance.ts";
import { ILoginResponse, ILogoutResponse } from "./interfaces/responses/auth.ts";

export class authApi {
    accessToken: string;
    refreshToken: string;
    constructor() {
        this.accessToken = '';
        this.refreshToken = '';
    }
    public registerApi = async (data: IRegisterRequest): Promise<IGetUserResponse> => {
        const url = '/user/register';
        const response = await axiosInstance.post(url, data);

        return response.data as IGetUserResponse;
    }

    public loginApi = async (data: ILoginRequest): Promise<ILoginResponse> => {
        const url = '/user/login';
        const response = await axiosInstance.post(url, data);

        const responseData = response.data as ILoginResponse;

        this.accessToken = responseData.accessToken;
        this.refreshToken = responseData.refreshToken;

        return responseData;
    }

    public logOut = async (): Promise<ILogoutResponse> => {
        const url = '/user/logout';
        const response = await axiosInstance.get(url, {
            headers: {
                Authorization: `Bearer ${this.accessToken}`
            }
        });

        this.refreshToken = '';
        this.accessToken = '';
        return response.data as ILogoutResponse;
    }
}