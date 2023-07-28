import { Router } from "express";
import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
  insertManyUsers,
  deleteManyUsers,
} from "./service.js";
import { isNumber } from "../utils/utils.js";

const userRouter = Router();

userRouter.get("/users", async (request, response) => {
  const users = await getUsers(request.query);
  if (users.length) {
    response.set("X-Total-Count", users.length);
  } else {
    response.set("X-Total-Count", "0");
    return response.status(200).json([]);
  }
  return response.status(200).json(users);
});

userRouter.get("/users/:id", async (request, response) => {
  const user = await getUserById(request.params.id);
  if (user?.mongoError) {
    return response.status(user.mongoError.status).json({ ...user.mongoError });
  }
  return response.status(200).json(user);
});

userRouter.post("/users", async (request, response) => {
  const userCreated = await createUser(request.body);

  if (userCreated?.mongoError) {
    return response.status(400).json({ ...userCreated.mongoError });
  }

  if (userCreated) return response.status(201).json(userCreated);
});

userRouter.put("/users/:id", async (request, response) => {
  if (!request?.params.id || !isNumber(request?.params.id)) {
    return response.status(500).send({
      errorMessage: "Internal Server Error: reach out support",
      status: 500,
    });
  }

  const userUpdated = await updateUser(request.params.id, request.body);

  if (userUpdated?.mongoError) {
    return response
      .status(userUpdated?.mongoError.status)
      .json({ ...userUpdated.mongoError });
  }

  if (userUpdated) {
    return response.status(200).json({
      message: `User ${userUpdated.email} updated with success`,
      status: 200,
    });
  }
});

userRouter.delete("/users/:id", async (request, response) => {
  if (!request?.params.id || !isNumber(request?.params.id)) {
    return response.status(500).send({
      errorMessage: "Internal Server Error: reach out support",
      status: 500,
    });
  }

  const userDeleted = await deleteUser(request.params.id);

  if (userDeleted?.mongoError) {
    return response
      .status(userDeleted?.mongoError.status)
      .json({ ...userDeleted.mongoError });
  }

  if (userDeleted) {
    return response.status(204).json();
  }
});

userRouter.post("/users/bulkInsert", async (request, response) => {
  const bulkInserted = await insertManyUsers();

  if (bulkInserted?.mongoError) {
    return response
      .status(bulkInserted?.mongoError.status)
      .json({ ...bulkInserted.mongoError });
  }

  if (bulkInserted) {
    return response.status(200).json({
      message: "Users properly inserted",
      status: 200,
    });
  }
});

userRouter.delete("/users/delete/bulkDelete", async (request, response) => {
  const bulkDeleted = await deleteManyUsers();

  if (bulkDeleted?.mongoError) {
    return response
      .status(bulkDeleted?.mongoError.status)
      .json({ ...bulkDeleted.mongoError });
  }

  if (bulkDeleted) {
    return response.status(200).json({
      message: "Users deleted",
      status: 200,
    });
  }
});

export { userRouter };
