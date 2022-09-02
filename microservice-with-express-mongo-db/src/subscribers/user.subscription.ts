import { Container } from 'typedi';
import { EventSubscriber, On } from 'event-dispatch';
import events from './events';
import { IUser } from '@/interfaces/IUser';
import { Logger } from 'winston';
import config from '@/config';
import TokenService from '@/services/token.service';
import { TokenUses } from '@/utils/enums';
import { IToken } from '@/interfaces/IToken';

@EventSubscriber()
export default class UserSubscriber {
    constructor(
        private tokenService: TokenService,
    ) { }
    
    @On(events.user.accountCreated)
    public async onUserSignUp(user: Partial<IUser>) {
        const Logger: Logger = Container.get('logger');
        try {
            if (config.auth.mustVerify) {
                Logger.silly('Sending Verification Email');
                await this.tokenService.GenerateToken(user._id, TokenUses.VERIFY_ACCOUNT)
            }

        } catch (e) {
            Logger.error(`🔥 Error on event ${events.user.accountCreated}: %o`, e);
            // Throw the error so the process dies (check src/app.ts)
            throw e;
        }
    }


    @On(events.user.verified)
    public async onAccountVerified(user: Partial<IUser>) {
        const Logger: Logger = Container.get('logger');
        try {
           

        } catch (e) {
            Logger.error(`🔥 Error on event ${events.user.verified}: %o`, e);
            throw e;
        }
    }

    @On(events.user.forgotPassword)
    public async onForgotPassword({ user, token }: { user: Partial<IUser> , token: Partial<IToken>}) {
        const Logger: Logger = Container.get('logger');
        try {
            // Send Emails
            const link = `${process.env.BASE_URL}/password/${user._id}`;

        } catch (e) {
            Logger.error(`🔥 Error on event ${events.user.verified}: %o`, e);
            throw e;
        }
    }
}