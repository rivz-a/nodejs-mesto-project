import { Router } from "express";
import {
  getAllCards,
  createCard,
  deleteCardById,
  likeCard,
  dislikeCard,
} from "../controllers/cards";

const cardsRouter = Router();

cardsRouter.get("/", getAllCards);
cardsRouter.post("/", createCard);
cardsRouter.delete("/:cardId", deleteCardById);
cardsRouter.put("/:cardId/likes", likeCard);
cardsRouter.delete("/:cardId/likes", dislikeCard);

export default cardsRouter;
