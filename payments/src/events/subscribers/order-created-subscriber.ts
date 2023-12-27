import {
  Subscriber,
  OrderCreatedEvent,
  Topics,
} from '@bratislavz/ticketing-common';
import { Order } from '../../models/order';

class OrderCreatedSubscriber extends Subscriber<OrderCreatedEvent> {
  readonly topic = Topics.OrderCreated;

  async onMessage(data: OrderCreatedEvent['data']) {
    const order = Order.build({
      id: data.id,
      price: data.ticket.price,
      status: data.status,
      userId: data.userId,
      version: data.version,
    });
    await order.save();
  }
}

export const orderCreatedSubscriber = new OrderCreatedSubscriber();
