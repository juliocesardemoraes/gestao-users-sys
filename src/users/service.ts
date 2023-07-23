/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "./schema.js";
import { IUserToCreate } from "./dto.js";

const getUsers = async (): Promise<any> => {
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

const createUser = async (userToCreate: IUserToCreate) => {
  try {
    const userCreate = await User.create(userToCreate);
    return userCreate;
  } catch (error) {
    const mongoError: any = {
      mongoError: { ...error },
    };

    if (error.code == "11000") {
      mongoError.mongoError.errorMessage = "Email is already in use";
    }

    return mongoError;
  }
};

const updateUser = async (id, userToUpdate: IUserToCreate) => {
  try {
    const userUpdate = await User.findOneAndUpdate({ _id: id }, userToUpdate);
    if (userUpdate == null) {
      const mongoError: any = {
        mongoError: { errorMessage: "User Not Found", status: 404 },
      };
      return mongoError;
    }
    return userUpdate;
  } catch (error) {
    const mongoError: any = {
      mongoError: { ...error },
    };
    return mongoError;
  }
};

const deleteUser = async (id) => {
  try {
    const userDeleted = await User.findOneAndDelete({ _id: id });
    if (userDeleted == null) {
      const mongoError: any = {
        mongoError: { errorMessage: "User Not Found", status: 404 },
      };
      return mongoError;
    }
    return userDeleted;
  } catch (error) {
    const mongoError: any = {
      mongoError: { ...error },
    };
    return mongoError;
  }
};

export { getUsers, createUser, getUserById, updateUser, deleteUser };
