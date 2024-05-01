import axios from 'axios';
import { getErrorMessage } from './helpers/getErrorMessage.ts';
import { snakeToCamel } from './helpers/snakeToCamel.ts';
import { camelToSnake } from './helpers/camelToSnake.ts';

export const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:5000',
});

axiosInstance.interceptors.request.use(
    function (config) {
        config.data = camelToSnake(config.data);
        config.headers['Content-Type'] = 'multipart/form-data';

        const token = localStorage.getItem('accessToken'); //getTokenFromSomewhere();
        if (
            token &&
            config.url !== '/user/login' &&
            config.url !== '/user/register'
        ) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    function (error) {
        return Promise.reject(error);
    }
);

axiosInstance.interceptors.response.use(
    function (response) {
        response.data = snakeToCamel(response.data);
        return response;
    },
    async function (error) {
        if (error.response && error.response.status === 401) {
            const token = ''; //await refreshToken();
            if (token) {
                const originalRequest = error.config;
                originalRequest.headers.Authorization = `Bearer ${token}`;
                return axiosInstance(originalRequest);
            }
        }

        console.log(error.response.data);
        error.response.data = getErrorMessage(error.response.data);
        return Promise.reject(error);
    }
);

// export type Response<T> = { resp: T; err: null } | { resp: null; err: Error }
//
// export async function httpHandler<T>(
//     p: Promise<T>
// ): Promise<{ resp: T; err: null } | { resp: null; err: Error }> {
//     let resp: T | null = null
//     let err: unknown | null = null
//     try {
//         resp = await p
//     } catch (error) {
//         err = error
//     }
//     return { resp, err } as Response<T>
// }
