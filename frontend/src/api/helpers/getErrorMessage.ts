import { IResponseObject } from "./snakeToCamel.ts";

export const getErrorMessage = (obj: IResponseObject): string => {
    for (const key in obj) {
        if (typeof obj[key] === 'string') {
            return obj[key];
        } else if (typeof obj[key] === 'object') {
            const result = getErrorMessage(obj[key]);
            if (result !== null) {
                return result;
            }
        }
    }

    return 'Technical issue';
}