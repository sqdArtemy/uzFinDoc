export interface IRegisterRequest {
    "email": string;
    "password": string;
    "nameFirstName": string;
    "nameLastName": string;
    "nameMiddleName": string;
    "phone": string;
}

export interface ILoginRequest {
    "email": string;
    "password": string;
}