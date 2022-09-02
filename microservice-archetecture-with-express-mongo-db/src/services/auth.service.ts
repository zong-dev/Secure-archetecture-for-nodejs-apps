import { Service, Inject } from 'typedi';
import config from '@/config';
import jwt from 'jsonwebtoken';
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import events from '@/subscribers/events';
import { IUser, IUserInput } from '@/interfaces/IUser';
import UserService from './user.service';
import TokenService from './token.service';
import { TokenUses } from '@/utils/enums';
import argon2 from 'argon2';


@Service()
export default class AuthService {
    constructor(
        private userService: UserService,
        @Inject('userModel') private userModel: Models.UserModel,
        private tokenService: TokenService,
        @Inject('logger') private logger,
        @Inject('settingModel') private settingModel: Models.SettingModel,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) {}


    public async SignUp(input: IUserInput): Promise<{ user: Partial<IUser>; token: string }> {
        try {

            const userRecord = await this.userService.CreateNewUser(input);

            this.logger.silly('Generating JWT');
            const token = this.generateToken(userRecord);

            if (!userRecord) {
                throw new Error('Failed to Create Account');
            }

            this.eventDispatcher.dispatch(events.user.accountCreated, { user: userRecord });

            /**
             * @TODO This is not the best way to deal with this
             * There should exist a 'Mapper' layer
             * that transforms data from layer to layer
             * but that's too over-engineering for now
             */
            const user = userRecord.toObject();
            Reflect.deleteProperty(user, 'password');
            Reflect.deleteProperty(user, 'salt');
            return { user, token };

        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async SignIn(email: string, password: string): Promise<{ user: any; token: string }> {
        const userRecord = await this.userService.GetUser(email);
        if (!userRecord) {
            throw new Error('User not registered');
        }
        /**
         * We use verify from argon2 to prevent 'timing based' attacks
         */
        this.logger.silly('Checking password');
        const validPassword = await argon2.verify(userRecord.password, password);
        if (validPassword) {
            this.logger.silly('Password is valid!');
            this.logger.silly('Generating JWT');
            const token = this.generateToken(userRecord);

            const user = userRecord.toObject();
            Reflect.deleteProperty(user, 'password');
            Reflect.deleteProperty(user, 'salt');

            this.eventDispatcher.dispatch(events.user.signIn, { user: userRecord });
            /**
             * Easy as pie, you don't need passport.js anymore :)
             */
            return { user, token };
        } else {
            throw new Error('Invalid Password');
        }
    }

    public async SendVerificationToken(user: String): Promise<any> {
        try {
            const userRecord = await this.userService.GetUser(user);
            if (!userRecord) throw new Error("Record does not exist");
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    public async VerifyAccount(token: String, user: String) {
        try {
            const userRecord = await this.userService.GetUser(user);
            if (!userRecord) throw new Error("Record does not exist");

            let tokenRecord = await this.tokenService.VerifyToken(userRecord._id, token);
            if (tokenRecord) {
                userRecord.verified = true;
                await userRecord.save();
                await this.tokenService.RemoveToken(tokenRecord._id);
                this.eventDispatcher.dispatch(events.user.verified, { user: userRecord });
                return { verified: true, status: 'success' };
            }
            throw new Error("Invalid or Expired Token!");
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    private generateToken(user) {
        const today = new Date();
        const exp = new Date(today);
        exp.setDate(today.getDate() + 60);

        /**
         * A JWT means JSON Web Token, so basically it's a json that is _hashed_ into a string
         * The cool thing is that you can add custom properties a.k.a metadata
         * Here we are adding the userId, role and name
         * Beware that the metadata is public and can be decoded without _the secret_
         * but the client cannot craft a JWT to fake a userId
         * because it doesn't have _the secret_ to sign it
         * more information here: https://softwareontheroad.com/you-dont-need-passport
         */
        this.logger.silly(`Sign JWT for userId: ${user._id}`);
        return jwt.sign(
            {
                _id: user._id, // We are gonna use this in the middleware 'isAuth'
                role: user.role,
                name: user.name,
                exp: exp.getTime() / 1000,
            },
            config.jwtSecret
        );
    }
}