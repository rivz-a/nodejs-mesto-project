import mongoose from "mongoose";

interface ICard {
  name: string;
  link: string;
  owner: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Поле name не может быть пустым"],
      minlength: [2, "Поле name должно быть не менее 2 символов"],
      maxlength: [30, "Поле name должно быть не более 30 символов"],
    },
    link: {
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
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "user",
    },
    likes: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "user" }],
      default: [],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    versionKey: false,
    select: false,
  }
);

export default mongoose.model<ICard>("card", cardSchema);
