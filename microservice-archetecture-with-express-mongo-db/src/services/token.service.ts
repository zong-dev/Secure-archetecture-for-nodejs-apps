import { TokenUses } from '@/utils/enums';
import { IUser } from '@/interfaces/IUser';
import { IToken } from '@/interfaces/IToken';

import { Service, Container, Inject } from 'typedi'
import { EventDispatcher, EventDispatcherInterface } from '@/decorators/eventDispatcher';
import { DateTime } from '@/utils/dateTime';
import moment from 'moment';
import config from '@/config';
import events from '@/subscribers/events';
const crypto = require("crypto");

@Service()
export default class TokenService {
    constructor(
        @Inject('userModel') private userModel: Models.UserModel,
        @Inject('tokenModel') private tokenModel: Models.TokenModel,
        @Inject('logger') private logger,
        @EventDispatcher() private eventDispatcher: EventDispatcherInterface,
    ) { }

    private generateRandomString(length) {
        const chars =
            "AaBbCcDdEeFfGgHhIiJjKkLlMmNnOoPpQqRrSsTtUuVvWwXxYyZz1234567890";
        const randomArray = Array.from(
            { length: length },
            (v, k) => chars[Math.floor(Math.random() * chars.length)]
        );

        const string = randomArray.join("");
        return string;
    }

    public async GenerateToken(userId: String, type: String): Promise<any> {
        try {

            let tokenRecord = await this.tokenModel.findOne({ userId: userId });
            this.logger.silly('Creating Token');

            const expireAt = moment().add(config.token.expirationTime, 'minutes').toDate();
            
            const tokenLength = type === TokenUses.PASSWORD ? 16 : 6;
            if (!tokenRecord) {
                tokenRecord = await this.tokenModel.create({
                    userId: userId,
                    value: this.generateRandomString(tokenLength),
                    type,
                    expireAt
                });
            }
            
            const token = tokenRecord.toObject();

            this.eventDispatcher.dispatch(events.token.onCreated, { token: token });

            return { token };
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }


    /**
     * Verify Generated Token
     */
    public async VerifyToken(id: String, value: String): Promise<any> {
        try {
            const userRecord = await this.userModel.findById(id);
            if (!userRecord) throw new Error("invalid link or token")

            this.logger.silly('Validating Token');

            const tokenRecord = await this.tokenModel.findOne({
                user: id,
                token: value,
            });

            if (!tokenRecord) throw new Error("Invalid link or expired");

            const token = tokenRecord.toObject();

            return { token };

        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }

    /**
     * Delete Token
     */
    public async RemoveToken(id: String): Promise<boolean> {
        try {

            const tokenRecord = await this.tokenModel.findById(id);
            if (!tokenRecord) throw new Error("invalid token")

            this.logger.silly('Removing Token');

            if (!tokenRecord) throw new Error("Invalid link or expired");
            await tokenRecord.delete();
            return true;
        } catch (e) {
            this.logger.error(e);
            throw e;
        }
    }
}