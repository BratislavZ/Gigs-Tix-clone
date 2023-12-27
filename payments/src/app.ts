import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import {
  NotFoundError,
  currentUser,
  errorHandler,
} from '@bratislavz/ticketing-common';
import { createChargeRouter } from './routes/new';

const app = express();
app.use(json());

app.use(currentUser);

app.use(createChargeRouter);

app.all('*', async () => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
