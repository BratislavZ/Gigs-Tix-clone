import {
  Subscriber,
  OrderCreatedEvent,
  Topics,
} from '@bratislavz/ticketing-common';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { producer } from '../../kafka';

class OrderCreatedSubscriber extends Subscriber<OrderCreatedEvent> {
  readonly topic = Topics.OrderCreated;

  async onMessage(data: OrderCreatedEvent['data']) {
    // Find the ticket that the order is reserving
    const ticket = await Ticket.findById(data.ticket.id);

    // If we don't have a ticket, throw an error
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Mark the ticket as being reserved by setting its orderId property
    ticket.set({ orderId: data.id });

    // Save the ticket
    await ticket.save();

    await new TicketUpdatedPublisher(producer).publish({
      id: ticket.id,
      version: ticket.version,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      orderId: ticket.orderId,
    });
  }
}

export const orderCreatedSubscriber = new OrderCreatedSubscriber();
