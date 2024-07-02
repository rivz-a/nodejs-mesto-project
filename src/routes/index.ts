import { Router } from "express";
import usersRouter from "./users";
import cardsRouter from "./cards";

const router = Router();

router.use("/users", usersRouter);
router.use("/cards", cardsRouter);
router.use('*', (req, res) => {
  res.status(404).json({ message: 'Not found' });
});

export default router;
