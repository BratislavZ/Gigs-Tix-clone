import { Kafka, Partitioners } from 'kafkajs';
import { ticketUpdatedSubscriber } from './events/subscribers/ticket-updated-subscriber';
import { ticketCreatedSubscriber } from './events/subscribers/ticket-created-subscriber';
import { expirationCompleteSubscriber } from './events/subscribers/expiration-complete-subscriber';
import { paymentCreatedSubscriber } from './events/subscribers/payment-created-subscriber';
import { BaseConsumer } from '@bratislavz/ticketing-common';

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
  [
    ticketUpdatedSubscriber,
    ticketCreatedSubscriber,
    expirationCompleteSubscriber,
    paymentCreatedSubscriber,
  ]
);

export { producer, consumer };
