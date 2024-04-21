import axios from "axios";
import { getErrorMessage } from "./helpers/getErrorMessage.ts";
import { snakeToCamel } from "./helpers/snakeToCamel.ts";
import { camelToSnake } from "./helpers/camelToSnake.ts";

export const axiosInstance = axios.create({
    baseURL: 'http://127.0.0.1:5000'
});

axiosInstance.interceptors.request.use(function (config) {
    config.data = camelToSnake(config.data);
    return config;
}, function (error) {
    return Promise.reject(error);
});

axiosInstance.interceptors.response.use(function (response) {
    response.data = snakeToCamel(response.data);
    return response;
}, function (error) {
    return Promise.reject(getErrorMessage(error));
});
