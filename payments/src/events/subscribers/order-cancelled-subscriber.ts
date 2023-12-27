import {
  Subscriber,
  OrderCancelledEvent,
  OrderStatus,
  Topics,
} from '@bratislavz/ticketing-common';
import { Order } from '../../models/order';

class OrderCancelledSubscriber extends Subscriber<OrderCancelledEvent> {
  readonly topic = Topics.OrderCancelled;

  async onMessage(data: OrderCancelledEvent['data']) {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Cancelled });
    await order.save();
  }
}

export const orderCancelledSubscriber = new OrderCancelledSubscriber();
