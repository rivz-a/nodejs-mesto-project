import mongoose from "mongoose";

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Поле name не может быть пустым"],
      minlength: [2, "Поле name должно быть не менее 2 символов"],
      maxlength: [30, "Поле name должно быть не более 30 символов"],
    },
    about: {
      type: String,
      required: [true, "Поле about не может быть пустым"],
      minlength: [2, "Поле about должно быть не менее 2 символов"],
      maxlength: [200, "Поле about должно быть не более 30 символов"],
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  {
    versionKey: false,
    select: false,
  }
);

export default mongoose.model<IUser>("user", userSchema);
