import {
  Subscriber,
  OrderStatus,
  PaymentCreatedEvent,
  Topics,
} from '@bratislavz/ticketing-common';

import { Order } from '../../models/order';

class PaymentCreatedSubscriber extends Subscriber<PaymentCreatedEvent> {
  readonly topic = Topics.PaymentCreated;

  async onMessage(data: PaymentCreatedEvent['data']) {
    const order = await Order.findById(data.orderId);

    if (!order) {
      throw new Error('Order not found');
    }

    order.set({ status: OrderStatus.Complete });
    await order.save();
  }
}

export const paymentCreatedSubscriber = new PaymentCreatedSubscriber();
