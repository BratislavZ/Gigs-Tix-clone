import { Order } from '../../models/order';
import { OrderCancelledPublisher } from '../publishers/order-cancelled-publisher';
import {
  Subscriber,
  ExpirationCompleteEvent,
  Topics,
  OrderStatus,
} from '@bratislavz/ticketing-common';
import { producer } from '../../kafka';

class ExpirationCompleteSubscriber extends Subscriber<ExpirationCompleteEvent> {
  readonly topic = Topics.ExpirationComplete;

  async onMessage(data: ExpirationCompleteEvent['data']): Promise<void> {
    const order = await Order.findById(data.orderId).populate('ticket');

    if (!order) {
      throw new Error('Order not found');
    }
    if (order.status === OrderStatus.Complete) {
      return;
    }

    order.set({
      status: OrderStatus.Cancelled,
    });
    await order.save();

    await new OrderCancelledPublisher(producer).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });
  }
}

export const expirationCompleteSubscriber = new ExpirationCompleteSubscriber();
