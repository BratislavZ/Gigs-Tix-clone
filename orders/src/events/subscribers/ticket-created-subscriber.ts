import {
  Subscriber,
  TicketCreatedEvent,
  Topics,
} from '@bratislavz/ticketing-common';
import { Ticket } from '../../models/ticket';

class TicketCreatedSubscriber extends Subscriber<TicketCreatedEvent> {
  readonly topic = Topics.TicketCreated;

  async onMessage(data: TicketCreatedEvent['data']) {
    const { id, price, title } = data;
    const ticket = Ticket.build({
      id,
      title,
      price,
    });
    await ticket.save();
  }
}

export const ticketCreatedSubscriber = new TicketCreatedSubscriber();
