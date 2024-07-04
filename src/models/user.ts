import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import type { IUser, UserModel } from "../types/user";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: [2, "Поле name должно быть не менее 2 символов"],
      maxlength: [30, "Поле name должно быть не более 30 символов"],
      default: "Жак-Ив Кусто",
    },
    about: {
      type: String,
      minlength: [2, "Поле about должно быть не менее 2 символов"],
      maxlength: [200, "Поле about должно быть не более 30 символов"],
      default: "Исследователь",
    },
    avatar: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => {
          const urlRegex =
            /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)$/;

          return urlRegex.test(v);
        },
        message: "Некорректный URL",
      },
      default:
        "https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png",
    },
    email: {
      type: String,
      required: [true, "Поле email не может быть пустым"],
      validate: {
        validator: (v: string) => validator.isEmail(v),
        message: "Поле e-mail должно быть валидным e-mail-адресом",
      },
      unique: true,
    },
    password: {
      type: String,
      required: [true, "Поле password не может быть пустым"],
      select: false,
    },
  },
  {
    versionKey: false,
    select: false,
  }
);

userSchema.static(
  "findUserByCredentials",
  function findUserByCredentials(email: string, password: string) {
    return this.findOne({ email })
      .select("+password")
      .then((user: IUser) => {
        if (!user) {
          return Promise.reject(new Error("Неправильные почта или пароль"));
        }

        return bcrypt.compare(password, user.password).then((matched) => {
          if (!matched) {
            return Promise.reject(new Error("Неправильные почта или пароль"));
          }

          return user;
        });
      });
  }
);

export default mongoose.model<IUser, UserModel>("user", userSchema);
