import { Request, Response } from "express";
import Card from "../models/card";
import type { AuthContext } from "../types/auth-context";

const BAD_REQUEST_CODE = 400;
const NOT_FOUND_CODE = 404;
const SERVER_ERROR_CODE = 500;

export const getAllCards = (req: Request, res: Response) => {
  return Card.find({})
    .then((cards) => {
      res.json(cards);
    })
    .catch(() => {
      res
        .status(SERVER_ERROR_CODE)
        .json({ message: "Ошибка по умолчанию." });
    });
};

export const deleteCardById = (req: Request, res: Response) => {
  Card.findByIdAndDelete(req.params.cardId)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError")
        res
          .status(NOT_FOUND_CODE)
          .json({ message: "Карточка с указанным _id не найдена." });
    });
};

export const createCard = (req: Request, res: Response<unknown, AuthContext>) => {
  const { name, link } = req.body;
  const owner = res.locals.user._id;

  return Card.create({ name, link, owner })
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res
          .status(BAD_REQUEST_CODE)
          .json({ message: "Переданы некорректные данные при создании карточки" });
      else
        return res
          .status(SERVER_ERROR_CODE)
          .json({ message: "Ошибка по умолчанию." });
    });
};

export const likeCard = (req: Request, res: Response<unknown, AuthContext>) => {
  const userId = res.locals.user._id;
  const cardId = req.params.cardId;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res
          .status(BAD_REQUEST_CODE)
          .json({ message: "Переданы некорректные данные для постановки/снятии лайка." });
      else if (err.name === "DocumentNotFoundError")
        return res
          .status(NOT_FOUND_CODE)
          .json({ message: "Передан несуществующий _id карточки." });
      else
        return res
          .status(SERVER_ERROR_CODE)
          .json({ message: "Ошибка по умолчанию." });
    });
};

export const dislikeCard = (req: Request, res: Response<unknown, AuthContext>) => {
  const userId = res.locals.user._id;
  const cardId = req.params.cardId;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .then((card) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === "ValidationError")
        return res
          .status(BAD_REQUEST_CODE)
          .json({ message: "Переданы некорректные данные для постановки/снятии лайка." });
      else if (err.name === "DocumentNotFoundError")
        return res
          .status(NOT_FOUND_CODE)
          .json({ message: "Передан несуществующий _id карточки." });
      else
        return res
          .status(SERVER_ERROR_CODE)
          .json({ message: "Ошибка по умолчанию." });
    });
};
