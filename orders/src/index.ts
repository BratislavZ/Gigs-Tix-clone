import mongoose from 'mongoose';
import { app } from './app';

import { consumer, producer } from './kafka';

const start = async () => {
  console.log('Starting up...');

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY must be defined');
  }
  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI must be defined');
  }
  if (!process.env.KAFKA_CLIENT_ID) {
    throw new Error('KAFKA_CLIENT_ID must be defined');
  }
  if (!process.env.KAFKA_BROKER) {
    throw new Error('KAFKA_BROKER must be defined');
  }
  if (!process.env.KAFKA_CONSUMER_GROUP_ID) {
    throw new Error('KAFKA_CONSUMER_GROUP_ID must be defined');
  }

  try {
    await producer.connect();
    await consumer.connect();

    await consumer.listen();

    process.on('SIGINT', async () => {
      await producer.disconnect();
    });
    process.on('SIGTERM', async () => {
      await producer.disconnect();
    });
    producer.on('producer.disconnect', () => {
      console.log('Producer disconnected');
      process.exit();
    });
    consumer.onDisconnect(() => {
      console.log('Consumer disconnected');
      process.exit();
    });

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
  } catch (err) {
    console.error(err);
  }

  app.listen(4000, () => {
    console.log('Listening on port 4000!!!!');
  });
};

start();
