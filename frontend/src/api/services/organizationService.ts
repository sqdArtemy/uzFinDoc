import { axiosInstance } from '../axiosInstance.ts';
import { ICreateOrganization } from '../interfaces/requests/organization.ts';
import { IOrganizationResponse } from '../interfaces/responses/organization.ts';
import { IGetUserResponse } from '../interfaces/responses/users.ts';
import { ITranslationResponse } from '../interfaces/responses/translation.ts';

export class OrganizationService {
    public createOrganization = async (data: ICreateOrganization) => {
        const url = '/organizations';
        return axiosInstance.post<IOrganizationResponse>(url, data);
    };

    public getOrganization = async (organizationId: number) => {
        const url = '/organizations/' + organizationId;
        return axiosInstance.get<IOrganizationResponse>(url);
    };

    public updateOrganization = async (
        data: { name: string },
        organizationId: number
    ) => {
        const url = '/organization/' + organizationId;
        return axiosInstance.put<IOrganizationResponse>(url, data);
    };

    public deleteOrganization = async (organizationId: number) => {
        const url = '/organization/' + organizationId;
        await axiosInstance.delete(url);
    };

    public getAllMembers = async (organizationId: number) => {
        const url = `/organization/${organizationId}/users`;
        return await axiosInstance.get<IGetUserResponse[]>(url);
    };

    public addMember = async (organizationId: number, email: string) => {
        const url = `/organization/${organizationId}/user/${email}`;
        return await axiosInstance.post<IGetUserResponse[]>(url);
    };

    public deleteMember = async (organizationId: number, email: string) => {
        const url = `/organization/${organizationId}/user/${email}`;
        return await axiosInstance.delete<IGetUserResponse[]>(url);
    };

    public getTranslations = async (organizationId: number) => {
        const url = `/organization/${organizationId}/translations`;
        return axiosInstance.get<ITranslationResponse[]>(url);
    };
}

export const organizationService = new OrganizationService();
