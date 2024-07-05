import { constants } from 'http2';
import { ErrorRequestHandler, Request, Response } from 'express';

const errorHandler: ErrorRequestHandler = (
  err,
  _req: Request,
  res: Response,
) => {
  const statusCode = err.statusCode || constants.HTTP_STATUS_INTERNAL_SERVER_ERROR;
  const message = statusCode === constants.HTTP_STATUS_INTERNAL_SERVER_ERROR
    ? 'Ошибка по умолчанию.'
    : err.message;

  res.status(statusCode).send({ message });
};

export default errorHandler;
