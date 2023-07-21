import { Router } from "express";
import {
  getUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser,
} from "./service.js";

const userRouter = Router();

userRouter.get("/users", async (request, response) => {
  const users = await getUsers();
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
  if (!request?.params || request?.params?.id?.length != 24) {
    return response.status(400).send({
      errorMessage: "Requisição mal feita: Verifique os campos",
      status: 400,
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
  if (!request?.params || request?.params?.id?.length != 24) {
    return response.status(400).send({
      errorMessage: "Requisição mal feita: Verifique os campos",
      status: 400,
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

export { userRouter };
