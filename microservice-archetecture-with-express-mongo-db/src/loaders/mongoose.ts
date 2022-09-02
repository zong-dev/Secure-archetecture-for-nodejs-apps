import mongoose from 'mongoose';
import { Db } from 'mongodb';
import config from '../config';

export default async () => {
  const connect = await mongoose.connect(config.databaseURL);
  return connect.connection.db;
};
