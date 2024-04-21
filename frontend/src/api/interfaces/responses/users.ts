export interface IGetUserResponse {
    "id": number;
    "email": string;
    "nameFirstName": string;
    "nameLastName": string;
    "nameMiddleName": string;
    "phone": string;
    "organizationId"?: number;
}