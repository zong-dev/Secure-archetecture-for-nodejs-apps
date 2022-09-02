export interface IUser {
  _id: string;
  name: string;
  email: string;
  avatar: string;
  password: string;
  salt: string;
  lastLogin: string;
  role: number;
  verified: boolean;
}

export interface IUserInput {
  name: string;
  email: string;
  password: string;
}
