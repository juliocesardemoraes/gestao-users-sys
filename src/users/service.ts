/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "./schema.js";
interface IUser {
  name: string;
  email: string;
  password: string;
}

const getUsers = async () => {
  const users = await User.find();
  return users;
};

const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (user == null) {
      const mongoError: any = {
        mongoError: { errorMessage: "User Not Found", status: 404 },
      };
      return mongoError;
    }
    return user;
  } catch (error) {
    console.log("Error on Get user by Id: ", error);

    const mongoError: any = {
      mongoError: {
        ...error,
        errorMessage: "Bad Request Check Your Parameter",
        status: 400,
      },
    };
    return mongoError;
  }
};

const createUser = async (userToCreate: IUser) => {
  try {
    const userCreate = await User.create(userToCreate);
    return userCreate;
  } catch (error) {
    console.log("Error on Create: ", error);

    const mongoError: any = {
      mongoError: { ...error },
    };

    if (error.code == "11000") {
      mongoError.mongoError.errorMessage = "Email is already in use";
    }

    return mongoError;
  }
};

const updateUser = async (id, userToCreate: IUser) => {
  try {
    const userCreate = await User.findOneAndUpdate({ _id: id }, userToCreate);
    if (userCreate == null) {
      const mongoError: any = {
        mongoError: { errorMessage: "User Not Found", status: 404 },
      };
      return mongoError;
    }
    return userCreate;
  } catch (error) {
    console.log("Error on Update: ", error);
    const mongoError: any = {
      mongoError: { ...error },
    };
    return mongoError;
  }
};

const deleteUser = async (id) => {
  try {
    const userCreate = await User.findOneAndDelete({ _id: id });
    if (userCreate == null) {
      const mongoError: any = {
        mongoError: { errorMessage: "User Not Found", status: 404 },
      };
      return mongoError;
    }
    return userCreate;
  } catch (error) {
    console.log("Error on Delete: ", error);
    const mongoError: any = {
      mongoError: { ...error },
    };

    return mongoError;
  }
};

export { getUsers, createUser, getUserById, updateUser, deleteUser };
