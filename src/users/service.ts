import { User } from "./schema.js";
interface IUser {
  name: string;
  email: string;
  password: string;
}

const getUsers = async (request, response) => {
  const users = await User.find();
  return users;
};

const createUser = async (userToCreate: IUser, response) => {
  try {
    const userCreate = await User.create(userToCreate);
    return userCreate;
  } catch (error) {
    error.error = true;
    return error;
  }
};

export { getUsers, createUser };
