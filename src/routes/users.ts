import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  updateUserProfile,
  updateUserAvatar,
  getCurrentUser,
} from "../controllers/users";

const usersRouter = Router();

usersRouter.get("/", getAllUsers);
usersRouter.get("/me", getCurrentUser);
usersRouter.get("/:userId", getUserById);
usersRouter.patch("/me", updateUserProfile);
usersRouter.patch("/me/avatar", updateUserAvatar);

export default usersRouter;
