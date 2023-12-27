import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { OrderCancelledEvent } from '@bratislavz/ticketing-common';
import { producer } from '../../../kafka';
import { orderCancelledSubscriber } from '../order-cancelled-subscriber';

async function setup() {
  const listener = orderCancelledSubscriber;

  const orderId = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({
    title: 'concert',
    price: 99,
    userId: 'asdf',
  });

  ticket.set({ orderId }); // we dont want to use build because we dont want ticket to have order by default

  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    version: 0,
    ticket: {
      id: ticket.id,
    },
  };

  return { listener, ticket, data };
}

it('updates the ticket, publishes an event', async () => {
  const { listener, ticket, data } = await setup();

  await listener.onMessage(data);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).not.toBeDefined();

  expect(producer.send).toHaveBeenCalled();
});
