import { IGetUserResponse } from "./interfaces/responses/users.ts";
import { axiosInstance } from "./axiosInstance.ts";
import { IUpdateUserRequest } from "./interfaces/requests/users.ts";

export class UserApi {
    public getCurrentUser = async (): Promise<IGetUserResponse> => {
        const url = '/me';
        const response = await axiosInstance.get(url);

        return response.data as IGetUserResponse;
    }

    public getUserById = async (id: number): Promise<IGetUserResponse> => {
        const url = '/user/' + id;
        const response = await axiosInstance.get(url);

        return response.data as IGetUserResponse;
    }

    public updateUser = async (id: number, data: IUpdateUserRequest): Promise<IGetUserResponse> => {
        const url = '/user/' + id;
        const response = await axiosInstance.put(url, data);
        return response.data as IGetUserResponse;
    }

    public deleteUser = async (id: number) => {
        const url = '/user/' + id;
        await axiosInstance.delete(url);
    }
}

export const userApi = new UserApi();