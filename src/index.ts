import express from "express";
import { connectToMongo } from "./database/connect.js";
import { userRouter } from "./users/controller.js";
import cors from "cors";

// SETUP DATABASE
connectToMongo();

const app = express();
app.use(cors());
app.use(express.json());

// SETUP ROUTES
app.use(userRouter);

app.listen("3000");

export default app;
