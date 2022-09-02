import { Service, Inject, Container } from "typedi";
import jwt from 'jsonwebtoken';
import config from '@/config';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';

@Service()
export default class UserService {
    constructor(
        @Inject('userModel') private userModel: Models.UserModel,
        @Inject('profileModel') private profileModel: Models.ProfileModel,
        @Inject('settingModel') private settingModel: Models.SettingModel,
        @Inject('logger') private logger,
    ){}


    public async GetUser(niddle: String): Promise<any> {
        try {
            this.logger.silly('Getting user Record');

            const userRecord = await this.userModel.findOne({
                $or: [
                    { email: niddle }, { _id: niddle }
                ]
            }).select('-password -salt -__v');

            if (!userRecord) throw new Error("User Record does not exist")

            const profileRecord = await this.profileModel.findOne({ user: userRecord._id })
            const profile = profileRecord.toObject();
            const user = userRecord.toObject();

            user.profile = profile;
            return user;

        } catch (e) {
            this.logger.error(e)
            throw e;
        }
    }

    public async CreateNewUser (input): Promise<any> {
        try {

            const salt = randomBytes(32);

            this.logger.silly('Hashing password');
            const hashedPassword = await argon2.hash(input.password, { salt });
            this.logger.silly('Creating user db record');

            const userRecord = await this.userModel.create({
                name: input.name,
                email: input.email,
                salt: salt.toString('hex'),
                password: hashedPassword,
                avatar: `https://avatars.dicebear.com/api/initials/${input.name}.svg`
            });

            this.logger.silly('Creating profile db record');
            const profileRecord = await this.profileModel.create({
                user: userRecord._id, 
            });

            this.logger.silly('Creating Setting db record');
            const settingRecord = await this.settingModel.create({
                user: userRecord._id
            })

        } catch (e) {
            this.logger.error(e)
            throw e;
        }
    }
}