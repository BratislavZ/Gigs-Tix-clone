import { consumer, producer } from './kafka';

const start = async () => {
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
  } catch (err) {
    console.error(err);
  }
};

start();
