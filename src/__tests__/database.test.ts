import { connectToMongo } from "../database/connect.js";
import mongoose from "mongoose";

const mockMongooseConnect = jest.fn();
const mockConnectionOn = jest.fn();

describe("Database connection", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    jest.mock("mongoose", () => ({
      connect: mockMongooseConnect,
      connection: {
        on: mockConnectionOn,
      },
    }));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it("should connect to the database successfully", async () => {
    jest.spyOn(mongoose, "connect").mockImplementation((uri: string): any => {
      return;
    });

    await connectToMongo();

    expect(mongoose.connect).toHaveBeenCalledTimes(1);
  });
});
