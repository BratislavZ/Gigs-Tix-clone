import {
  Subscriber,
  TicketUpdatedEvent,
  Topics,
} from '@bratislavz/ticketing-common';
import { Ticket } from '../../models/ticket';

class TicketUpdatedSubscriber extends Subscriber<TicketUpdatedEvent> {
  readonly topic = Topics.TicketUpdated;

  async onMessage(data: TicketUpdatedEvent['data']) {
    const ticket = await Ticket.findByEvent(data);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const { title, price } = data;

    ticket.set({
      title,
      price,
    });
    await ticket.save();

    console.log(ticket.toString());
  }
}

export const ticketUpdatedSubscriber = new TicketUpdatedSubscriber();
