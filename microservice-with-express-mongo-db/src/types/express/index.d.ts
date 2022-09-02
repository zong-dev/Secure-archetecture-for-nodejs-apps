import { IMedia } from '@/interfaces/IMedia';
import { INotification } from '@/interfaces/INotification';
import { IProfile } from '@/interfaces/IProfile';
import { IRestriction } from '@/interfaces/IRestriction';
import { ISetting } from '@/interfaces/ISetting';
import { IToken } from '@/interfaces/IToken';
import {Document, Model} from 'mongoose';
import { IUser } from '../../interfaces/IUser';
declare global {
  namespace Express {
    export interface Request {
      user: IUser & Document;
    }    
  }

  namespace Models {
    export type UserModel = Model<IUser & Document>;
    export type ProfileModel = Model<IProfile & Document>;
    export type TokenModel = Model<IToken & Document>;
    export type SettingModel = Model<ISetting & Document>;
    export type MediaModel = Model<IMedia & Document>;
    export type RestrictionModel = Model<IRestriction & Document>;
    export type NotificationModel = Model<INotification & Document>;
  }
}
