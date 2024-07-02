import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import router from "./routes/index";
import helmet from 'helmet';
import type { AuthContext } from "./types/auth-context";

const { PORT = 3000, MONGO_URL = "mongodb://localhost:27017/mestodb" } =
  process.env;

const app = express();

app.use(express.json());

app.use(helmet());

app.use(
  (req: Request, res: Response<unknown, AuthContext>, next: NextFunction) => {
    res.locals.user = {
      _id: "6682e2a58d91bc9ae4754631",
    };

    next();
  }
);

app.use(router);

mongoose.connect(MONGO_URL);

const connect = async () => {
  try {
    await app.listen(PORT);
    console.log(`Сервер запущен на порту: ${PORT}`);
  } catch (error) {
    console.log(error);
  }
};

connect();
