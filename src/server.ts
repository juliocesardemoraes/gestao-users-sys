import express from "express";
import { router } from "./routes.js";
import { connectToMongo } from "./database/connect.js";
import { userRouter } from "./users/controller.js";

// SETUP DATABASE
connectToMongo();

const app = express();
app.use(express.json());

// SETUP ROUTES
app.use(userRouter);

app.listen("3000");
