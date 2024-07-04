import { Router } from "express";
import usersRouter from "./users";
import cardsRouter from "./cards";
import { login, createUser } from "../controllers/users";

import auth from "../middlewares/auth";
import { celebrate, Joi } from "celebrate";

const router = Router();

router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  login
);
router.post(
  "/signun",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
      avatar: Joi.string(),
    }),
  }),
  createUser
);

router.use(auth);

router.use("/users", usersRouter);
router.use("/cards", cardsRouter);

router.use("*", (req, res) => {
  res.status(404).json({ message: "Not found" });
});

export default router;
