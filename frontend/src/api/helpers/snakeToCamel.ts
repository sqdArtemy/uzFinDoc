export type IResponseObject = { [key: string]: any };
export const snakeToCamel = (obj: IResponseObject): IResponseObject => {
    if (obj instanceof ArrayBuffer) {
        return obj;
    } else if (Array.isArray(obj)) {
        return obj.map((item) => snakeToCamel(item));
    } else if (typeof obj === 'object' && obj !== null) {
        const newObj: IResponseObject = {};
        Object.keys(obj).forEach((key) => {
            const camelKey = key.replace(/_([a-z])/g, (_, letter) =>
                letter.toUpperCase()
            );
            newObj[camelKey] = snakeToCamel(obj[key]);
        });
        return newObj;
    } else {
        return obj;
    }
};
