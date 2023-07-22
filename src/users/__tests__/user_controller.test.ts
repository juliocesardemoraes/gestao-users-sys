import { userRouter } from "../controller";
import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "../service";

jest.mock("../service");

describe("userRouter", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  describe("GET /users", () => {
    it("should return a list of users", async () => {
      const mockedUsers = [
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
      ];
      //   console.log("mockUsers", mockedUsers);
      //   jest.spyOn(userRouter, "get").mockImplementation(async () => mockedUsers);

      //   const request = {};
      //   const response = {
      //     status: jest.fn().mockReturnThis(),
      //     json: jest.fn(),
      //   };

      //   await userRouter.get("/users", request, response);
      //   getUsers.mockResolvedValue(() => {
      //     return mockedUsers;
      //   });

      //   const request = {};
      //   const response = {
      //     status: jest.fn().mockReturnThis(),
      //     json: jest.fn(),
      //   };

      //   await userRouter.get("/users", request, response);

      //   expect(getUsers).toHaveBeenCalledTimes(1);
      //   expect(response.status).toHaveBeenCalledWith(200);
      //   expect(response.json).toHaveBeenCalledWith(mockedUsers);
    });
  });
});
