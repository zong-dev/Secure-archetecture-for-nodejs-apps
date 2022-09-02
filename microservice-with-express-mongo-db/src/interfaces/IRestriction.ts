export interface IRestriction {
    _id: string;
    user: string;
    duration: number;
    cause: string;
    active: boolean;
}