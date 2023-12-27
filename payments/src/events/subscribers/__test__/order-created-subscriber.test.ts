import { OrderCreatedEvent, OrderStatus } from '@bratislavz/ticketing-common';
import mongoose from 'mongoose';
import { Order } from '../../../models/order';
import { orderCreatedSubscriber } from '../order-created-subscriber';

async function setup() {
  const subscriber = orderCreatedSubscriber;

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    expiresAt: 'alskdfj',
    userId: 'alskdfj',
    status: OrderStatus.Created,
    ticket: {
      id: 'alskdfj',
      price: 10,
    },
  };

  return { subscriber, data };
}

it('replicates the order info', async () => {
  const { subscriber, data } = await setup();

  await subscriber.onMessage(data);

  const replicatedOrder = await Order.findById(data.id);

  expect(replicatedOrder!.price).toEqual(data.ticket.price);
});
