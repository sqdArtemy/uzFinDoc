export interface IGetUserResponse {
    id: number;
    email: string;
    nameFirstName: string;
    nameLastName: string;
    nameMiddleName: string;
    phone: string;
    organization?: {
        id: number;
        name: string;
        createdAt: string | Date;
        email: string;
    } | null;
}
