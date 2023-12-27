import mongoose from 'mongoose';
import { TicketCreatedEvent } from '@bratislavz/ticketing-common';
import { Ticket } from '../../../models/ticket';
import { ticketCreatedSubscriber } from '../ticket-created-subscriber';

async function setup() {
  const subscriber = ticketCreatedSubscriber;

  // create a fake data event
  const data: TicketCreatedEvent['data'] = {
    version: 0,
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  return {
    subscriber,
    data,
  };
}

it('creates and saves a ticket', async () => {
  const { subscriber, data } = await setup();

  // call the onMessage function with the data object + message object
  await subscriber.onMessage(data);

  // write assertions to make sure a ticket was created!
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  // we put ! because we want it to throw an error if it's null
  expect(ticket!.title).toEqual(data.title);
  expect(ticket!.price).toEqual(data.price);
});
