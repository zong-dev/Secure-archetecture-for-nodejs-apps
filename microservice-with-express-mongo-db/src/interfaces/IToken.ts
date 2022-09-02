export interface IToken {
    _id: string;
    user: string;
    value: string;
    type: string;
    expireAt: string;
    duration: number;
}