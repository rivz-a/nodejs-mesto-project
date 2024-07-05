import { Router } from "express";
import {
  getAllCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} from "../controllers/cards";

import { celebrate, Joi } from "celebrate";

const cardsRouter = Router();

cardsRouter.get("/", getAllCards);
cardsRouter.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      link: Joi.string().uri(),
    }),
  }),
  createCard
);
cardsRouter.delete(
  "/:cardId",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  deleteCardById
);
cardsRouter.put(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  likeCard
);
cardsRouter.delete(
  "/:cardId/likes",
  celebrate({
    params: Joi.object().keys({
      cardId: Joi.string().hex().length(24).required(),
    }),
  }),
  dislikeCard
);

export default cardsRouter;
