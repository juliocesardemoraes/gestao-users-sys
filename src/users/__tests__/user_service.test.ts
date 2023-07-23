import { IUser, IUserToCreate } from "./../dto.js";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
} from "../service.js";
import { User } from "../schema.js";
import { MongoError } from "mongodb";

const userToCreateJest = {
  name: "teste1",
  email: "teste@gmail.com",
  password: "123456",
};

jest.mock("../schema.js", () => ({
  User: {
    find: jest.fn().mockResolvedValue([
      {
        _id: "64aab3d900eace7a20ac3318",
        name: "teste1",
        email: "teste@gmail.com",
        password: "123456",
        __v: 0,
      },
      {
        _id: "64aab3d900eace7a20ac3340",
        name: "teste",
        email: "teste2@gmail.com",
        password: "12345678",
        __v: 0,
      },
    ]),
    findById: jest.fn().mockImplementation((id) => {
      if (id === "64aab3d900eace7a20ac3318") {
        return {
          _id: "64aab3d900eace7a20ac3318",
          name: "teste1",
          email: "teste@gmail.com",
          password: "123456",
          __v: 0,
        };
      } else if (id == "mongodberror") {
        throw Error("Fake MongoDB error");
      } else {
        return null;
      }
    }),
    create: jest.fn().mockImplementation((user: IUserToCreate) => {
      if (user.name === "mongodberror") {
        throw { message: "Error", code: "11000" };
      }

      return {
        _id: "any_id",
        ...user,
        __v: 1,
      };
    }),
    findOneAndUpdate: jest
      .fn()
      .mockImplementation((id: string, userToUpdate: IUserToCreate) => {
        if (userToUpdate == null) {
          return null;
        }

        if (userToUpdate.name == "mongodberror")
          throw { message: "MongoDb Error" };

        return {
          ...userToUpdate,
        };
      }),
    findOneAndDelete: jest.fn().mockImplementation(({ _id: id }) => {
      if (id == null) {
        return null;
      }

      if (id == "mongodberror") throw { message: "MongoDb Error" };

      return userToCreateJest;
    }),
  },
}));
describe("userServices", () => {
  let userToCreate = {
    name: "teste1",
    email: "teste@gmail.com",
    password: "123456",
  };

  afterAll(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    userToCreate = {
      name: "teste1",
      email: "teste@gmail.com",
      password: "123456",
    };
  });

  describe("GET USERS", () => {
    it("should Get All Users from Mocked Database ", async () => {
      const result = await getUsers();
      expect(result).toHaveLength(2);
    });

    it("should get one user from its id", async () => {
      const result = await getUserById("64aab3d900eace7a20ac3318");
      expect(result).toStrictEqual({
        _id: "64aab3d900eace7a20ac3318",
        name: "teste1",
        email: "teste@gmail.com",
        password: "123456",
        __v: 0,
      });
    });

    it("should give an error when not finding an user by it's id", async () => {
      expect.assertions(1);
      const result = await getUserById("64aab3d900eace7a20ac3314");
      expect(result).toStrictEqual({
        mongoError: { errorMessage: "User Not Found", status: 404 },
      });
    });

    it("should test the catch error", async () => {
      const result = await getUserById("mongodberror");

      expect(result).toEqual({
        mongoError: {
          errorMessage: "Bad Request Check Your Parameter",
          status: 400,
        },
      });
    });
  });

  describe("Create User", () => {
    it("should create an user", async () => {
      const userCreated = await createUser(userToCreate);
      expect(userCreated).toEqual({ _id: "any_id", ...userToCreate, __v: 1 });
    });
    it("should return an error if it wasn't able to create an user", async () => {
      userToCreate.name = "mongodberror";
      const userCreatedTryError = await createUser(userToCreate);
      expect(userCreatedTryError).toEqual({
        mongoError: {
          code: "11000",
          errorMessage: "Email is already in use",
          message: "Error",
        },
      });
    });
  });

  describe("Update User", () => {
    it("should update an user", async () => {
      const userUpdated = await updateUser("any_id", userToCreate);
      expect(userUpdated).toEqual(userUpdated);
    });
    it("should return an error if it wasnt able to update an user", async () => {
      const userUpdated = await updateUser("any_id", null);
      expect(userUpdated).toEqual({
        mongoError: { errorMessage: "User Not Found", status: 404 },
      });
    });
    it("should return an error on the catch block", async () => {
      userToCreate.name = "mongodberror";
      const userUpdated = await updateUser("any_id", userToCreate);
      expect(userUpdated).toEqual({ mongoError: { message: "MongoDb Error" } });
    });
  });

  describe("Update User", () => {
    it("should delete an user", async () => {
      const userDeleted = await deleteUser("any_id");
      expect(userDeleted).toEqual(userToCreateJest);
    });
    it("should return an error if it wasnt able to update an user", async () => {
      const userDeleted = await deleteUser(null);
      expect(userDeleted).toEqual({
        mongoError: { errorMessage: "User Not Found", status: 404 },
      });
    });
    it("should return an error on the catch block", async () => {
      const userDeleted = await deleteUser("mongodberror");
      expect(userDeleted).toEqual({
        mongoError: { message: "MongoDb Error" },
      });
    });
  });
});
