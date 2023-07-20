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

const getUserById = async (request, response) => {
  try {
    const user = await User.findById(request);
    if (user == null) {
      const mongoError: any = {
        mongoError: { errorMessage: "User Not Found", status: 404 },
      };
      return mongoError;
    }
    return user;
  } catch (error) {
    console.log("ERROR", error);
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

const createUser = async (userToCreate: IUser, response) => {
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

const updateUser = async (userToCreate: IUser, response) => {
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

export { getUsers, createUser, getUserById, updateUser };
