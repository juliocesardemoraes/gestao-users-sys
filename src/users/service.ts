/* eslint-disable @typescript-eslint/no-explicit-any */
import { User } from "./dto/schema.js";
// eslint-disable-next-line no-unused-vars
import { IUser, IUserToCreate } from "./dto/dto.js";
// eslint-disable-next-line no-unused-vars
import { faker } from "@faker-js/faker";

const getUsers = async (params): Promise<any> => {
  if (params.range) {
    const parsedJson = JSON.parse(params.range);
    if (!parsedJson[1]) return;

    const users = await User.find()
      .sort({ createdAt: 1 })
      .skip(parsedJson[0])
      .limit(parsedJson[1]);
    return users;
  }

  const users = await User.find();
  return users;
};

const getUserById = async (id) => {
  try {
    const user = await User.findOne({ id: id });
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
    let countQuery = await User.countDocuments({});
    countQuery++;
    const userCreate = await User.create({
      id: countQuery,
      ...userToCreate,
    });
    return userCreate;
  } catch (error) {
    const mongoError: any = {
      mongoError: { ...error },
    };

    if (error.code == "11000") {
      mongoError.mongoError.errorMessage = "Email is already in use!";
    }

    return mongoError;
  }
};

const updateUser = async (id, userToUpdate: IUserToCreate) => {
  try {
    const userUpdate: any = await User.findOneAndUpdate(
      { id: id },
      userToUpdate
    );
    if (userUpdate == null) {
      const mongoError: any = {
        mongoError: { errorMessage: "User Not Found", status: 404 },
      };
      return mongoError;
    }
    delete userUpdate._doc._id;
    return userUpdate._doc;
  } catch (error) {
    const mongoError: any = {
      mongoError: { ...error },
    };
    return mongoError;
  }
};

const deleteUser = async (id) => {
  try {
    const userDeleted = await User.findOneAndDelete({ id: id });
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

/**
 * Create a bunch of users for faster development - DEV USE ONLY
 * @returns {Array<IUser>} Array of users
 */
const insertManyUsers = async () => {
  try {
    // Get the count of documents in the User collection
    const countQuery = await User.countDocuments({});
    const arrayUsers = [];

    for (let i = 0; i < 10; i++) {
      const randomName = faker.person.fullName();
      const randomEmail = faker.internet.email();
      const randomPassword = faker.internet.password();
      arrayUsers.push({
        id: i + countQuery,
        name: randomName,
        email: randomEmail,
        password: randomPassword,
      });
    }

    const manyUsers = User.insertMany(arrayUsers);
    return manyUsers;
  } catch (error) {
    const mongoError: any = {
      mongoError: { ...error },
    };
    return mongoError;
  }
};

/**
 * DELETE MANY USERS - DEV USAGE ONLY
 * @returns {Array<IUser>} Array of users
 */
const deleteManyUsers = async () => {
  try {
    // Get the count of documents in the User collection
    const users = await User.deleteMany({});
    return users;
  } catch (error) {
    const mongoError: any = {
      mongoError: { ...error },
    };
    return mongoError;
  }
};

export {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  insertManyUsers,
  deleteManyUsers,
};
