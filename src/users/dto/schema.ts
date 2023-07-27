import mongoose from "mongoose";
import { IUserToCreate } from "./dto.js";

const userSchema = new mongoose.Schema({
  id: {
    type: Number,
    default: 1,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
});

const User = mongoose.model("User", userSchema);
userSchema.pre("save", async function (next) {
  if (!this.isNew) {
    return next();
  }
  try {
    const highestIdUser: IUserToCreate = await User.findOne()
      .sort({ id: -1 })
      .exec();
    this.id = highestIdUser ? highestIdUser.id + 1 : 0;
    next();
  } catch (err) {
    next(err);
  }
});
export { User };
