import { NextFunction, Request, Response } from "express";
import User from "../models/user";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import type { IUser } from "../types/user";

import { Error as MongooseError } from "mongoose";
import {
  NotFoundError,
  BadRequestError,
  AuthenticationError,
  ConflictError
} from "../errors/error";
import { constants } from "http2";

const DUPLICATE_KEY_ERROR_CODE = "E11000";

export const login = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, "some-secret-key", {
        expiresIn: "7d",
      });

      res.cookie("jwt", token, {
        httpOnly: true,
        secure: false, // установите в true, если используете протокол HTTPS
        maxAge: 3600000, // срок действия куки в миллисекундах
      });

      res.send({ token });
    })
    .catch((error) => {
      return next(new AuthenticationError(error.message));
    });
};

export const getAllUsers = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return User.find({})
    .orFail(() => new NotFoundError("Пользователь не найден"))
    .then((users) => {
      res.json(users);
    })
    .catch((error) => {
      next(error);
    });
};

export const getUserById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return User.findById(req.params.userId)
    .orFail(() => new NotFoundError("Пользователь по указанному _id не найден"))
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      if (error instanceof MongooseError.CastError) {
        return next(
          new BadRequestError("Пользователь по указанному _id не найден")
        );
      }

      return next(error);
    });
};

export const createUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, about, avatar, email, password } = req.body;

  bcrypt
    .hash(password, 10)
    .then((hash: string) =>
      User.create({
        name,
        about,
        avatar,
        email,
        password: hash,
      })
    )
    .then((user: IUser) =>
      res.status(constants.HTTP_STATUS_CREATED).send({ data: user })
    )
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        return next(new BadRequestError(error.message));
      }

      if (
        error instanceof Error &&
        error.message.startsWith(DUPLICATE_KEY_ERROR_CODE)
      ) {
        return next(new ConflictError("Имя уже используется"));
      }

      return next(error);
    });
};

export const updateUserProfile = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, about } = req.body;

  const userId = req.params.userId;

  return User.findByIdAndUpdate(
    userId,
    { name, about },
    { new: true, runValidators: true }
  )
    .orFail(() => new NotFoundError("Пользователь не найден"))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        return next(new BadRequestError(error.message));
      }

      return next(error);
    });
};

export const updateUserAvatar = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { avatar } = req.body;
  const userId = req.params.userId;

  return User.findByIdAndUpdate(
    userId,
    { avatar },
    { new: true, runValidators: true }
  )
    .orFail(() => new NotFoundError("Пользователь не найден"))
    .then((user) => res.send({ data: user }))
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        return next(
          new BadRequestError(
            "Переданы некорректные данные при обновлении аватара"
          )
        );
      }

      return next(error);
    });
};

export const getCurrentUser = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return User.findById(req.params.userId)
    .orFail(() => new NotFoundError("Пользователь по указанному _id не найден"))
    .then((user) => {
      res.json(user);
    })
    .catch((error) => {
      return next(error);
    });
};
