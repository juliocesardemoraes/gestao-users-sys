import { Router } from "express";
import { userRouter } from "./users/controller.js";

const router = Router();

Router.use(userRouter);

export { router };
