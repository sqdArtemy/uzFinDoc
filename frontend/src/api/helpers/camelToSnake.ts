import { IResponseObject } from './snakeToCamel.ts';

export const camelToSnake = (obj: IResponseObject): IResponseObject => {
    if (obj instanceof FormData) {
        return obj;
    }

    if (Array.isArray(obj)) {
        return obj.map((item) => camelToSnake(item));
    } else if (typeof obj === 'object' && obj !== null) {
        const newObj: IResponseObject = {};
        Object.keys(obj).forEach((key) => {
            const snakeKey = key.replace(
                /[A-Z]/g,
                (letter) => `_${letter.toLowerCase()}`
            );
            newObj[snakeKey] = camelToSnake(obj[key]);
        });
        return newObj;
    } else {
        return obj;
    }
};
