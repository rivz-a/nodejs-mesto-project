import { Request, Response, NextFunction } from 'express';
import { Error as MongooseError } from 'mongoose';
import { constants } from 'http2';
import Card from '../models/card';

import NotFoundError from '../errors/not-found-error';
import BadRequestError from '../errors/bad-request-error';
import ForbiddenError from '../errors/forbidden-error';

export const getAllCards = (
  req: Request,
  res: Response,
  next: NextFunction,
) => Card.find({})
  .orFail(() => new NotFoundError('Карточка не найдена'))
  .then((cards) => {
    res.json(cards);
  })
  .catch((error) => {
    next(error);
  });

export const deleteCardById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const card = await Card.findById(req.params.cardId).orFail(
      () => new NotFoundError('Карточка не найдена'),
    );

    if (req.params.userId !== card.owner.toString()) {
      return next(new ForbiddenError('Нет доступа'));
    }

    await Card.findByIdAndDelete(req.params.cardId).orFail(
      () => new NotFoundError('Карточка не найдена'),
    );

    return res.status(constants.HTTP_STATUS_CREATED).send();
  } catch (error) {
    if (error instanceof MongooseError.CastError) {
      return next(new BadRequestError('Карточка с указанным _id не найдена.'));
    }

    return next(error);
  }
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
            'Переданы некорректные данные при создании карточки',
          ),
        );
      }

      return next(error);
    });
};

export const likeCard = (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        return next(
          new BadRequestError(
            'Переданы некорректные данные для постановки/снятии лайка.',
          ),
        );
      }

      if (error instanceof MongooseError.CastError) {
        return next(
          new BadRequestError('Передан несуществующий _id карточки.'),
        );
      }

      return next(error);
    });
};

export const dislikeCard = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const { userId } = req.params;
  const { cardId } = req.params;

  return Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  )
    .orFail(() => new NotFoundError('Карточка не найдена'))
    .then((card) => res.send({ data: card }))
    .catch((error) => {
      if (error instanceof MongooseError.ValidationError) {
        return next(
          new BadRequestError(
            'Переданы некорректные данные для постановки/снятии лайка.',
          ),
        );
      }

      if (error instanceof MongooseError.CastError) {
        return next(
          new BadRequestError('Передан несуществующий _id карточки.'),
        );
      }

      return next(error);
    });
};
