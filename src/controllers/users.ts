import { Request, Response } from "express";
import User from "../models/user";
import type { AuthContext } from "../types/auth-context";

const BAD_REQUEST_CODE = 400;
const NOT_FOUND_CODE = 404;
const SERVER_ERROR_CODE = 500;
const CREATED_CODE = 201;

export const getAllUsers = (req: Request, res: Response) => {
  return User.find({})
    .orFail()
    .then((users) => {
      res.json(users);
    })
    .catch(() => {
      res.status(SERVER_ERROR_CODE).json({ message: "Ошибка по умолчанию." });
    });
};

export const getUserById = (req: Request, res: Response) => {
  return User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError")
        return res
          .status(NOT_FOUND_CODE)
          .json({ message: "Пользователь по указанному _id не найден" });
      else
        return res
          .status(SERVER_ERROR_CODE)
          .json({ message: "Ошибка по умолчанию." });
    });
};

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User.create({ name, about, avatar })
    .then((user) => res.status(CREATED_CODE).send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res
          .status(BAD_REQUEST_CODE)
          .json({
            message: "Переданы некорректные данные при создании пользователя",
          });
      else
        return res
          .status(SERVER_ERROR_CODE)
          .json({ message: "Ошибка по умолчанию." });
    });
};

export const updateUserProfile = (
  req: Request,
  res: Response<unknown, AuthContext>
) => {
  const { name, about } = req.body;
  const userId = res.locals.user._id;

  return User.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res
          .status(BAD_REQUEST_CODE)
          .json({
            message: "Переданы некорректные данные при обновлении профиля",
          });
      else if (err.name === "DocumentNotFoundError")
        return res
          .status(NOT_FOUND_CODE)
          .json({ message: "Пользователь с указанным _id не найден." });
      else
        return res
          .status(SERVER_ERROR_CODE)
          .json({ message: "Ошибка по умолчанию." });
    });
};

export const updateUserAvatar = (
  req: Request,
  res: Response<unknown, AuthContext>
) => {
  const { avatar } = req.body;
  const userId = res.locals.user._id;

  return User.findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .then((user) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res
          .status(BAD_REQUEST_CODE)
          .json({
            message: "Переданы некорректные данные при обновлении аватара",
          });
      else if (err.name === "DocumentNotFoundError")
        return res
          .status(NOT_FOUND_CODE)
          .json({ message: "Пользователь с указанным _id не найден." });
      else
        return res
          .status(SERVER_ERROR_CODE)
          .json({ message: "Ошибка по умолчанию." });
    });
};
