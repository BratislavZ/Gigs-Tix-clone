import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { Order, OrderStatus } from '../../../models/order';
import { ExpirationCompleteEvent } from '@bratislavz/ticketing-common';
import { producer } from '../../../kafka';
import { expirationCompleteSubscriber } from '../expiration-complete-subscriber';

async function setup() {
  const subscriber = expirationCompleteSubscriber;

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'alskdfj',
    expiresAt: new Date(),
    ticket,
  });
  await order.save();

  const data: ExpirationCompleteEvent['data'] = {
    orderId: order.id,
  };

  return { subscriber, order, ticket, data };
}

it('updates the order status to cancelled', async () => {
  const { subscriber, order, data } = await setup();

  await subscriber.onMessage(data);

  const updatedOrder = await Order.findById(order.id);

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
});

it('emits an OrderCancelled event', async () => {
  const { subscriber, order, data } = await setup();

  await subscriber.onMessage(data);

  expect(producer.send).toHaveBeenCalled();

  const eventData = JSON.parse(
    (producer.send as jest.Mock).mock.calls[0][0].messages[0].value
  );

  expect(eventData.id).toEqual(order.id);
});
