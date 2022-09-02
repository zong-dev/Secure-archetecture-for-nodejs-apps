import { IUser } from '@/interfaces/IUser';
import { Service, Inject, Container } from 'typedi';
import moment from 'moment';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { ISetting } from '@/interfaces/ISetting';
import MediaService from './media.service';

@Service()
export default class ProfileService {
    constructor(
        @Inject('logger') private logger,
        @Inject('userModel') private userModel: Models.UserModel,
        @Inject('profileModel') private profileModel: Models.ProfileModel,
        @Inject('settingModel') private settingModel: Models.SettingModel,
        private media: MediaService
    ) { }

    public async InitialSetup(user: IUser, input): Promise<any> {
        try {
            const dateOfBirth = moment(input.dateOfBirth, "YYYY-MM-DD");

            const age = Number(dateOfBirth.from(new Date));

            const profileRecord = await this.profileModel.findOneAndUpdate({ user: user._id }, {
                firstname: input.firstname, 
                lastname: input.lastname,
                othername: input.othername, 
                country: input.country,
                state: input.state,
                phone: input.phone,
                dateOfBirth: dateOfBirth.toDate(), 
                age: Number(age),
            });

            const profile = profileRecord.toObject();

            return profile
        } catch (e) {
            this.logger.error(e)
            throw new Error(e);

        }
    }

    public async UpdateAvatar(user, file): Promise<any> {
        try {

            const userRecord = await this.userModel.findById(user._id);
            if (!userRecord) throw new Error('User record does not exist');

            const avatar = await this.media.AddFile(file, user).then(async (fileData) => {
                if (fileData) {
                    userRecord.avatar = fileData.url;
                    await userRecord.save();
                    const user = userRecord.toObject();
                    return { user };
                }
                throw new Error('Failed to upload avatar')
            })

            return { avatar };

        } catch (e) {
            this.logger.error(e)
            throw new Error(e);
        }
    }

    public async UpdateProfile(user: IUser, input): Promise<any> {
        try {
            const userRecord = await this.userModel.findById(user._id);
            if (!userRecord) throw new Error('User record does not exist');

            const profileRecord = await this.profileModel.findOneAndUpdate({ user: user._id }, {
                firstname: input.firstname, 
                lastname: input.lastname,
                othername: input.othername, 
                country: input.country,
                state: input.state,
                phone: input.phone
            });
            const profile = profileRecord.toObject();

            return profile;

        } catch (e) {
            this.logger.error(e)
            throw new Error(e);
        }
    }

    public async UpdateSetting(user: IUser, input): Promise<{ setting }> {
        try {
            const userRecord = await this.userModel.findById(user._id);
            if (!userRecord) throw new Error('User record does not exist');
            const setting = await this.settingModel.findOneAndUpdate({ user: userRecord._id }, {
                ...input
            });
            return { setting };
        } catch (e) {
            this.logger.error(e)
            throw new Error(e);
        }
    }

    public async GetSetting(user: Partial<IUser>): Promise<any> {
        try {
            const settingRecord = await this.settingModel.findOne({ _id: user._id })
            const setting = settingRecord.toObject();
            return { setting };
        } catch (e) {
            this.logger.error(e)
            throw new Error(e);
        }
    }

}