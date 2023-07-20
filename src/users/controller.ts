import { Router } from "express";
import { getUsers, createUser, getUserById, updateUser } from "./service.js";

const userRouter = Router();

userRouter.get("/users", async (request, response) => {
  const users = await getUsers(request, response);
  return response.status(200).json(users);
});

userRouter.get("/users/:id", async (request, response) => {
  const user = await getUserById(request.params.id, response);
  if (user?.mongoError) {
    return response.status(user.mongoError.status).json({ ...user.mongoError });
  }
  return response.status(200).json(user);
});

userRouter.post("/users", async (request, response) => {
  const userCreated = await createUser(request.body, response);

  if (userCreated?.mongoError) {
    return response.status(400).json({ ...userCreated.mongoError });
  }

  if (userCreated) return response.status(201).json(userCreated);
});

userRouter.put("/users", async (request, response) => {
  const userUpdated = await updateUser(request.body, response);

  if (userUpdated?.mongoError) {
    return response
      .status(userUpdated?.mongoError.status)
      .json({ ...userUpdated.mongoError });
  }

  if (userUpdated) return response.status(200).json(userUpdated);
});

export { userRouter };
