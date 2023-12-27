import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { OrderStatus } from '@bratislavz/ticketing-common';
import { producer } from '../../../kafka';
import { orderCreatedSubscriber } from '../order-created-subscriber';

async function setup() {
  const subscriber = orderCreatedSubscriber;

  // Create and save a ticket
  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asdf',
  });
  await ticket.save();

  // Create the fake data event
  const data = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'alskdfj',
    expiresAt: 'alskdfj',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  return { subscriber, ticket, data };
}

it('sets the userId of the ticket', async () => {
  const { subscriber, ticket, data } = await setup();

  await subscriber.onMessage(data);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('publishes a ticket updated event', async () => {
  const { subscriber, data } = await setup();

  await subscriber.onMessage(data);

  expect(producer.send).toHaveBeenCalled();

  const ticketUpdatedData = JSON.parse(
    (producer.send as jest.Mock).mock.calls[0][0].messages[0].value
  );

  expect(data.id).toEqual(ticketUpdatedData.orderId);
});
