import request from "supertest";
import app from "../../index.js";
import { IUserToCreate } from "../dto/dto.js";

// Mock the getUsers function
jest.mock("../service.js", () => ({
  getUsers: jest.fn().mockResolvedValue([
    { id: 1, name: "John" },
    { id: 2, name: "Jane" },
  ]),
  getUserById: jest.fn().mockImplementation((id) => {
    if (id == "null") return { mongoError: { status: 500 } };

    return { id: 1, name: "John" };
  }),
  createUser: jest.fn().mockImplementation((body: IUserToCreate) => {
    if (body.email == "forceError") return { mongoError: { status: 400 } };

    return { ...body };
  }),
  updateUser: jest.fn().mockImplementation((id, body: IUserToCreate) => {
    if (body.email == "forceError") {
      return { mongoError: { status: 400 } };
    }

    return { ...body };
  }),
  deleteUser: jest.fn().mockImplementation((id) => {
    if (id == "64aab3d900eace7a20ac3err")
      return { mongoError: { status: 500 } };

    return { id: 1, name: "John" };
  }),
}));

describe("users routes", () => {
  describe("Get Users", () => {
    it("should get all users", async () => {
      const res = await request(app).get("/users");
      expect(res.status).toBe(200);
      expect(res.body).toEqual([
        { id: 1, name: "John" },
        { id: 2, name: "Jane" },
      ]);
    });

    it("should get an user by id", async () => {
      const res = await request(app).get("/users/1");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ id: 1, name: "John" });
    });

    it("should return an error", async () => {
      const res = await request(app).get("/users/null");
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ status: 500 });
    });
  });

  describe("Insert User", () => {
    it("should create an user", async () => {
      const res = await request(app)
        .post("/users")
        .send({ id: 1, name: "John", email: "john@gmail.com" });
      expect(res.status).toBe(201);
    });

    it("should return an error when trying to create an user", async () => {
      const res = await request(app)
        .post("/users")
        .send({ id: 1, name: "John", email: "forceError" });
      expect(res.status).toBe(400);
    });
  });
  describe("Update User", () => {
    it("should update an user ", async () => {
      const res = await request(app)
        .put("/users/1")
        .send({ id: 1, name: "John", email: "john@gmail.com" });
      expect(res.status).toBe(200);
    });
    it("should give an error because of the faulty request", async () => {
      const res = await request(app)
        .put("/users/64aab3d900eace7a20ac")
        .send({ id: 1, name: "John", email: "john@gmail.com" });
      expect(res.status).toBe(500);
      expect(res.body).toStrictEqual({
        errorMessage: "Internal Server Error: reach out support",
        status: 500,
      });
    });

    it("should give an error because of mongoose problem", async () => {
      await request(app)
        .put("/users/64aab3d900eace7a20ac3318")
        .send({ id: 1, name: "John", email: "forceError" });
    });
  });
  describe("Delete User", () => {
    it("should give an error because of the faulty request", async () => {
      const res = await request(app).delete("/users/64aab3d900eace7a20ac");
      expect(res.status).toBe(500);
      expect(res.body).toStrictEqual({
        errorMessage: "Internal Server Error: reach out support",
        status: 500,
      });
    });
    it("should delete an user ", async () => {
      const res = await request(app).delete("/users/1");
      expect(res.status).toBe(204);
    });

    it("should give an error because of mongoose problem", async () => {
      await request(app).delete("/users/1");
    });
  });
});
