import { IGetUserResponse } from '../interfaces/responses/users.ts';
import { axiosInstance } from '../axiosInstance.ts';
import { IUpdateUserRequest } from '../interfaces/requests/users.ts';

export class UserService {
    public getCurrentUser = async () => {
        console.trace();
        const url = '/me';
        return axiosInstance.get<IGetUserResponse>(url);
    };

    public getUserById = async (id: number): Promise<IGetUserResponse> => {
        const url = '/user/' + id;
        const response = await axiosInstance.get(url);

        return response.data as IGetUserResponse;
    };

    public updateUser = async (id: number, data: IUpdateUserRequest) => {
        const url = '/user/' + id;
        return axiosInstance.put<IUpdateUserRequest>(url, data);
    };

    public deleteUser = async (id: number) => {
        const url = '/user/' + id;
        await axiosInstance.delete(url);
    };
}

export const userService = new UserService();
