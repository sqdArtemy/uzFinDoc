import { axiosInstance } from '../axiosInstance.ts'
import { ICreateOrganization } from "../interfaces/requests/organization.ts";
import {IOrganizationResponse} from "../interfaces/responses/organization.ts";

export class OrganizationService {
    public createOrganization = async (data: ICreateOrganization) => {
        const url = '/organizations'
        return axiosInstance.post<IOrganizationResponse>(url, data)
    }

    public getOrganization = async (id: number) => {
        const url = '/organizations/' + id;
        return axiosInstance.get<IOrganizationResponse>(url)
    }

    public updateOrganization = async (data: ICreateOrganization, id: number) => {
        const url = '/organization/' + id;
        return axiosInstance.put<IOrganizationResponse>(url, data)
    }

    public deleteOrganization = async (id: number) => {
        const url = '/organization/' + id
        await axiosInstance.delete(url)
    }
}

export const organizationService = new OrganizationService()
