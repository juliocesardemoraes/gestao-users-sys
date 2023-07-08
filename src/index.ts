import mongoose from "mongoose";
import "dotenv/config";

const check = true;
mongoose.connect(process.env.DB_KEY);
