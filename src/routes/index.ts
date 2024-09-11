import { Router } from 'express';
import { celebrate, Joi } from 'celebrate';
import usersRouter from './users';
import cardsRouter from './cards';
import { login, createUser } from '../controllers/users';

import NotFoundError from '../errors/not-found-error';

import auth from '../middlewares/auth';

const router = Router();

router.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
    }),
  }),
  login,
);
router.post(
  '/signun',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required(),
      password: Joi.string().required(),
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(200),
      avatar: Joi.string().uri(),
    }),
  }),
  createUser,
);
router.get('/crash-test', () => {
  setTimeout(() => {
    throw new Error('Сервер сейчас упадёт');
  }, 0);
});

router.use(auth);

router.use('/users', usersRouter);
router.use('/cards', cardsRouter);

router.use('*', (req, res, next) => {
  next(new NotFoundError({ message: 'Not found' }));
});

export default router;
