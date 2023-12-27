import { Kafka, Partitioners } from 'kafkajs';
import { BaseConsumer } from '@bratislavz/ticketing-common';
import { orderCancelledSubscriber } from './events/subscribers/order-cancelled-subscriber';
import { orderCreatedSubscriber } from './events/subscribers/order-created-subscriber';

const kafka = new Kafka({
  clientId: process.env.KAFKA_CLIENT_ID,
  brokers: [`${process.env.KAFKA_BROKER}`],
});

const producer = kafka.producer({
  createPartitioner: Partitioners.DefaultPartitioner,
});

const consumer = new BaseConsumer(
  kafka.consumer({
    groupId: process.env.KAFKA_CONSUMER_GROUP_ID!,
    sessionTimeout: 6000,
  }),
  [orderCancelledSubscriber, orderCreatedSubscriber]
);

export { producer, consumer };
