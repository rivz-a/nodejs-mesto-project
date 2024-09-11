import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';

import helmet from 'helmet';
import router from './routes/index';

import errorHandler from './middlewares/error';
import { requestLogger, errorLogger } from './middlewares/logger';

const { PORT = 3000, MONGO_URL = 'mongodb://localhost:27017/mestodb' } = process.env;

const app = express();

app.use(cors());

app.use(express.json());

app.use(helmet());

app.use(requestLogger);

app.use(router);

app.use(errorLogger);

app.use(errorHandler);

mongoose.connect(MONGO_URL);

const connect = async () => {
  await app.listen(PORT);
};

connect();
