import { IGetUserResponse } from './users.ts';

export interface ILoginResponse {
    user: {
        id: number;
        email: string;
        nameFirstName: string;
        nameLastName: string;
        nameMiddleName: string;
        phone: string;
        organization: null | {
            id: number;
            name: string;
            createdAt: string | Date;
            email: string;
            owner: IGetUserResponse;
        };
    };
    accessToken: string;
    refreshToken: string;
}

export interface ILogoutResponse {
    message: string;
}

export interface IRefreshTokenResponse {
    accessToken: string;
}
