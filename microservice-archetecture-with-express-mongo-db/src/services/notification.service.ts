import { IUser } from '@/interfaces/IUser';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { Container, Inject, Service } from 'typedi';
import events from '@/subscribers/events';
import ProfileService from './profile.service';
import moment from 'moment';
import { paginate } from '@/utils/paginate';
import { NotifyTypes } from '@/utils/enums';
@Service()
export default class NotificationService {
    constructor(
        @Inject('logger') private logger,
        @Inject('notificationModel') private notificationModel: Models.NotificationModel,
        private profileService: ProfileService,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) { }

    
    public async Notify(data, user: Partial<IUser>): Promise<any> {
        try {
            this.logger.silly('Creating new notification record');
            const setting = await this.profileService.GetSetting(user as Partial<IUser>);
            const notificationRecord = await this.notificationModel.create({
                user: user._id,
                data: data,
                notifiable_type: setting.notifyType,
            });

            this.eventDispatcher.dispatch(events.notification.newNotification, { notification: notificationRecord })

            const notification = notificationRecord.toObject();
            return { notification }

        } catch (e) {
            this.logger.error(e)
            throw e;
        }
    }

    public async MarkAsRead(id, user: Partial<IUser>): Promise<any> {
        try {
            this.logger.silly('Getting notification record');
            const notificationRecord = await this.notificationModel.findOne({
                _id: id, user: user._id
            })

            if (!notificationRecord) throw new Error('Record does not exist')

            this.logger.silly('Marking notification as read');
            await notificationRecord.update({ readAt: moment().toDate() })

            return true;

        } catch (e) {
            this.logger.error(e)
            throw e;
        }
    }

    public async Notifications(page, size, user: Partial<IUser>): Promise<any> {
        try {
            const skip = (page - 1) * size;
            this.logger.silly('Getting notification records');
            const notificationRecords = await this.notificationModel.find(paginate({
                $or: [{ notifiable_type: NotifyTypes.APP }, { notifiable_type: NotifyTypes.BOTH }]
            }, skip, size, { createdAt: - 1 }, {}))
                .populate('user', 'name email avatar')
            return { notificationRecords }
        } catch (e) {
            this.logger.error(e)
            throw e;
        }
    }

    public async RemoveNotification(id, user: Partial<IUser>): Promise<any> {
        try {
            this.logger.silly('Removing notification record');
            const notificationRecord = await this.notificationModel.findOneAndRemove({
                _id: id, user: user._id
            })

            if (!notificationRecord) throw new Error('Record does not exist')

            return true;

        } catch (e) {
            this.logger.error(e)
            throw e;
        }
    }
}