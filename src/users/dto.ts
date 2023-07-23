export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  __v: number;
}

export interface IUserToCreate {
  name: string;
  email: string;
  password: string;
}
