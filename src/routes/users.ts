import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUser,
} from "../controllers/users";

import { celebrate, Joi } from "celebrate";

const usersRouter = Router();

usersRouter.get("/", getAllUsers);
usersRouter.get("/me", getCurrentUser);
usersRouter.get("/:userId", getUserById);
usersRouter.patch("/me",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
    }),
  }), updateUserProfile);
usersRouter.patch("/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().uri(),
    }),
  }), updateUserAvatar);

export default usersRouter;
