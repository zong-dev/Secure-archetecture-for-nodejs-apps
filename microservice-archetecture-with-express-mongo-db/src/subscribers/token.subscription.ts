import { Container } from "typedi";
import { Logger } from "winston";
import { EventSubscriber, On } from 'event-dispatch';
import events from "./events";
import { IToken } from "@/interfaces/IToken";

@EventSubscriber()
export default class TokenSubscriber {

    @On(events.token.onCreated)
    public async onTokenCreated({ token }) {
        const Logger: Logger = Container.get('logger');
        try {
            // const UserModel = Container.get('UserModel') as mongoose.Model<IUser & mongoose.Document>;
            // const userRecord = await UserModel.findByIdAndDelete(user._id, { $set: { lastLogin: new Date() } })

        } catch (e) {
            Logger.error(`🔥 Error on event ${events.token.onCreated}: %o`, e);
            throw e;
        }
    }

}