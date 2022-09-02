import { TokenUses } from '@/utils/enums';
// import { IResetPasswordInputDTO, IUser } from '@/interfaces/IUser';
import { Service, Container, Inject } from 'typedi'
// import MailerService from './mail';
import argon2 from 'argon2';
import { randomBytes } from 'crypto';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import events from '@/subscribers/events';
import UserService from './user.service';
import TokenService from './token.service';
import { IResetPasswordInput } from '@/interfaces/IResetPassword';

@Service()
export default class PasswordService {
    constructor(
        @Inject('logger') private logger,
        @Inject('userModel') private userModel: Models.UserModel,
        private tokenService: TokenService,
        private userService: UserService,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) { }

    public async SendResetPasswordEmail(input: { email: String }): Promise<any> {
        try {
            this.logger.silly('Getting user record')

            const {_id, email, name } = await this.userService.GetUser(input.email)

            const tokenRecord = await this.tokenService.GenerateToken(_id, TokenUses.PASSWORD);

            this.eventDispatcher.dispatch(events.user.forgotPassword, { user: { _id, email, name }, token: tokenRecord })

            return { status: 'success', delivered: true};

        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async ResetPassword(input: IResetPasswordInput, token: String): Promise<any> {
        try {
            this.logger.silly('Resetting user password')
            const userRecord = await this.userModel.findOne({ where: { _id: input.user } });
            if (!userRecord) throw new Error("User record does not exist");

            const tokenRecord = await this.tokenService.VerifyToken(input.user, input.token);

            const salt = randomBytes(32);
            const hashedPassword = await argon2.hash(input.password, { salt });
            userRecord.password = hashedPassword;
            userRecord.salt = salt.toString('hex');
            await userRecord.save();

            await this.tokenService.RemoveToken(tokenRecord._id);

            return { status: 'success' };

        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async ChangePassword(user: String, input): Promise<any> {
        try {
            this.logger.silly('Updatting user password')
            const userRecord = await this.userModel.findOne({ _id: user });
            if (!userRecord) throw new Error("User record does not exist");

            const checkPassword = await argon2.verify(userRecord.password, input.password).then(async argon2Match => {
                if (argon2Match) {
                    this.logger.silly('Hashing password');
                    const salt = randomBytes(32);
                    const hashedPassword = await argon2.hash(input.password, { salt });
                    userRecord.salt = salt.toString('hex');
                    userRecord.password = hashedPassword;
                    await userRecord.save();
                    return { status: 'success' };
                }

                throw new Error('Password Mismatched');
            })

        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
}