import { Router } from "express";
import {
  getAllUsers,
  getUserById,
  createUser,
  updateUserProfile,
  updateUserAvatar,
} from "../controllers/users";

const usersRouter = Router();

usersRouter.get("/", getAllUsers);
usersRouter.get("/:userId", getUserById);
usersRouter.post("/", createUser);
usersRouter.patch("/me", updateUserProfile);
usersRouter.patch("/me/avatar", updateUserAvatar);

export default usersRouter;
