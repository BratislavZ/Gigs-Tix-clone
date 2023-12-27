import {
  Subscriber,
  OrderCreatedEvent,
  Topics,
} from '@bratislavz/ticketing-common';
import { expirationQueue } from '../../queues/expiration-queue';

class OrderCreatedSubscriber extends Subscriber<OrderCreatedEvent> {
  readonly topic = Topics.OrderCreated;

  async onMessage(data: OrderCreatedEvent['data']) {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();
    console.log('Waiting this many milliseconds to process the job:', delay);

    await expirationQueue.add(
      {
        orderId: data.id,
      },
      {
        delay,
      }
    );
  }
}

export const orderCreatedSubscriber = new OrderCreatedSubscriber();
