import { IGetUserResponse } from "./users.ts";

export interface IOrganizationResponse {
    "id": number,
    "name": string,
    "createdAt": string | Date,
    "owner": IGetUserResponse;
}