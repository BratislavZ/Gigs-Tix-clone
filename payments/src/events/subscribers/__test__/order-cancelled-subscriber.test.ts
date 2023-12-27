import mongoose from 'mongoose';
import { Order } from '../../../models/order';
import { OrderCancelledEvent, OrderStatus } from '@bratislavz/ticketing-common';
import { orderCancelledSubscriber } from '../order-cancelled-subscriber';

async function setup() {
  const subscriber = orderCancelledSubscriber;

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    price: 10,
    userId: 'alskdfj',
    version: 0,
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    version: order.version + 1,
    ticket: {
      id: 'alskdfj',
    },
  };

  return { subscriber, order, data };
}

it('updates the status of the order', async () => {
  const { subscriber, order, data } = await setup();

  await subscriber.onMessage(data);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});
