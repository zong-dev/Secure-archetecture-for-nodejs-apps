export interface INotification {
    _id: string;
    user: string;
    data: any;
    notifiable_type: string;
    readAt: string;
}