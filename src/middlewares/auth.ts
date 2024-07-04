import { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

import type { SessionRequest } from "../types/user";

import AuthenticationError from "../errors/authentication-error";

const extractBearerToken = (header: string) => {
  return header.replace("Bearer ", "");
};

export default (req: SessionRequest, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    return next(new AuthenticationError({ message: "Необходима авторизация" }));
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, "super-strong-secret");
  } catch (error) {
    return next(new AuthenticationError(error));
  }

  req.user = payload;

  next();
};
