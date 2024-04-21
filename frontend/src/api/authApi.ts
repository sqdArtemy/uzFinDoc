import { ILoginRequest, IRegisterRequest } from "./interfaces/requests/auth.ts";
import { IGetUserResponse } from "./interfaces/responses/users.ts";
import { axiosInstance} from "./axiosInstance.ts";
import { ILoginResponse, ILogoutResponse } from "./interfaces/responses/auth.ts";

export class AuthApi {
    public registerApi = async (data: IRegisterRequest): Promise<IGetUserResponse> => {
        const url = '/user/register';
        const response = await axiosInstance.post(url, data);

        return response.data as IGetUserResponse;
    }

    public loginApi = async (data: ILoginRequest): Promise<ILoginResponse> => {
        const url = '/user/login';
        const response = await axiosInstance.post(url, data);

        const responseData = response.data as ILoginResponse;

        localStorage.setItem('accessToken', responseData.accessToken);
        localStorage.setItem('refreshToken', responseData.refreshToken);
        return responseData;
    }

    public logOut = async (): Promise<ILogoutResponse> => {
        const url = '/user/logout';
        const response = await axiosInstance.get(url);

        return response.data as ILogoutResponse;
    }
}

export const authApi = new AuthApi();