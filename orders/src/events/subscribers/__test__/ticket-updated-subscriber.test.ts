import mongoose from 'mongoose';
import { Ticket } from '../../../models/ticket';
import { TicketUpdatedEvent } from '@bratislavz/ticketing-common';
import { ticketUpdatedSubscriber } from '../ticket-updated-subscriber';

async function setup() {
  const subscriber = ticketUpdatedSubscriber;

  // Create and save a ticket
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 20,
  });
  await ticket.save();

  // Create a fake data object
  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: 'concert2',
    price: 999,
    userId: 'asdasd',
  };

  return {
    subscriber,
    data,
    ticket,
  };
}

it('finds, updates, and saves a ticket', async () => {
  const { subscriber, data, ticket } = await setup();

  await subscriber.onMessage(data);

  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.title).toEqual(data.title);
  expect(updatedTicket!.price).toEqual(data.price);
  expect(updatedTicket!.version).toEqual(data.version);
});
