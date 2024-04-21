import axios from "axios";
import { getErrorMessage } from "./helpers/getErrorMessage.ts";
import { snakeToCamel } from "./helpers/snakeToCamel.ts";
import { camelToSnake } from "./helpers/camelToSnake.ts";

export const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:5000'
});

axiosInstance.interceptors.request.use(function (config) {
    config.data = camelToSnake(config.data);
    const token = localStorage.getItem('accessToken'); //getTokenFromSomewhere();
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
}, function (error) {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(function (response) {
    response.data = snakeToCamel(response.data);
    return response;
}, async function (error) {
    if (error.response && error.response.status === 401) {
        const token = ''; //await refreshToken();
        if (token) {
            const originalRequest = error.config;
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
        }
    }

    error.response.data = getErrorMessage(error.response.data);
    return Promise.reject(error);
});
