import { Router } from "express";
import { getUsers, createUser } from "./service.js";

const userRouter = Router();

userRouter.get("/users", async (request, response) => {
  const users = await getUsers(request, response);
  return response.status(200).json(users);
});

userRouter.post("/users", async (request, response) => {
  const userCreated = await createUser(request.body, response);

  if (userCreated.error) {
    let mongoError = { ...userCreated };

    if (userCreated.code == "11000") {
      mongoError = {
        errorMessage: "Email is already in use",
        mongoError: { ...userCreated },
      };
    }

    return response.status(400).json({ mongoError });
  }

  if (userCreated) return response.status(201).json(userCreated);
});

export { userRouter };

// import { Router } from "express";
// import { getUsersRoute, createUserRoute } from "./users/controller.js";

// const router = Router();

// router.get("/users", (request, response) => {
//   getUsersRoute(request, response);
// });

// router.post("/users", (request, response) => {
//   createUserRoute(request, response);
// });

// export { router };

// import * as express from "express";
// import { PersonHandler } from "./person.handler";
// const router = express.Router();

// router.route("/:id").put(PersonHandler.edit).delete(PersonHandler.remove);
// router.route("/").get(PersonHandler.list).post(PersonHandler.add);

// export default router;
