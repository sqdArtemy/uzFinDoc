import { IGetUserResponse } from "./interfaces/responses/users.ts";
import { axiosInstance } from "./axiosInstance.ts";
import { IUpdateUserRequest } from "./interfaces/requests/users.ts";

export class userApi {
    accessToken: string;
    refreshToken: string;
    constructor() {
        this.accessToken = '';
        this.refreshToken = '';
    }

    private headers = () => {
        return {
            headers: {
                Authorization: `Bearer ${this.accessToken}`
            }
        }
    }
    public getCurrentUser = async (): Promise<IGetUserResponse> => {
        const url = '/me';
        const response = await axiosInstance.get(url, this.headers());

        return response.data as IGetUserResponse;
    }

    public getUserById = async (id: number): Promise<IGetUserResponse> => {
        const url = '/user/' + id;
        const response = await axiosInstance.get(url, this.headers());

        return response.data as IGetUserResponse;
    }

    public updateUser = async (id: number, data: IUpdateUserRequest): Promise<IGetUserResponse> => {
        const url = '/user/' + id;
        const response = await axiosInstance.put(url, data, this.headers());
        return response.data as IGetUserResponse;
    }

    public deleteUser = async (id: number) => {
        const url = '/user/' + id;
        await axiosInstance.delete(url, this.headers());
    }
}