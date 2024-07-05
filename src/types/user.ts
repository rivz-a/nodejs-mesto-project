import mongoose from 'mongoose';
import { Request } from 'express';
import { JwtPayload } from 'jsonwebtoken';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

export interface UserModel extends mongoose.Model<IUser> {
  findUserByCredentials: (
    /* eslint-disable no-unused-vars */
    email: string,
    password: string
    /* eslint-enable no-unused-vars */
  ) => Promise<mongoose.Document<unknown, IUser>>;
}

export interface SessionRequest extends Request {
  user?: string | JwtPayload;
}
