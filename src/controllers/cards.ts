import { Request, Response, NextFunction } from "express";
import Card from "../models/card";
import { NotFoundError, BadRequestError } from "../errors/error";
import { Error as MongooseError } from "mongoose";
import { constants } from "http2";

export const getAllCards = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return Card.find({})
    .orFail(() => new NotFoundError("Карточка не найдена"))
    .then((cards) => {
      res.json(cards);
    })
    .catch((error) => {
      next(error);
    });
};

export const deleteCardById = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  Card.findByIdAndDelete(req.params.cardId)
    .orFail(() => new NotFoundError("Карточка не найдена"))
    .then(() => {
      res.status(constants.HTTP_STATUS_CREATED).send();
    })
    .catch((error) => {
      if (error instanceof MongooseError.CastError) {
        return next(
          new BadRequestError("Карточка с указанным _id не найдена.")
        );
      }

      return next(error);
    });
};

export const createCard = (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const owner = req.params.userId;

  return Card.create({ name, link, owner })
    .then((card) => res.status(constants.HTTP_STATUS_CREATED).send({ data: card }))
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        return next(
          new BadRequestError(
            "Переданы некорректные данные при создании карточки"
          )
        );
      }

      return next(error);
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const userId = req.params.userId;
  const cardId = req.params.cardId;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Карточка не найдена"))
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        return next(
          new BadRequestError(
            "Переданы некорректные данные для постановки/снятии лайка."
          )
        );
      }

      if (error instanceof MongooseError.CastError) {
        return next(
          new BadRequestError("Передан несуществующий _id карточки.")
        );
      }

      return next(error);
    });
};

export const dislikeCard = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.userId;
  const cardId = req.params.cardId;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true }
  )
    .orFail(() => new NotFoundError("Карточка не найдена"))
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        return next(
          new BadRequestError(
            "Переданы некорректные данные для постановки/снятии лайка."
          )
        );
      }

      if (error instanceof MongooseError.CastError) {
        return next(
          new BadRequestError("Передан несуществующий _id карточки.")
        );
      }

      return next(error);
    });
};
