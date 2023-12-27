import {
  Subscriber,
  OrderCancelledEvent,
  Topics,
} from '@bratislavz/ticketing-common';
import { Ticket } from '../../models/ticket';
import { TicketUpdatedPublisher } from '../publishers/ticket-updated-publisher';
import { producer } from '../../kafka';

class OrderCancelledSubscriber extends Subscriber<OrderCancelledEvent> {
  readonly topic = Topics.OrderCancelled;

  async onMessage(data: OrderCancelledEvent['data']): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);

    if (!ticket) {
      throw new Error('Ticket not found');
    }

    ticket.set({ orderId: undefined });
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

export const orderCancelledSubscriber = new OrderCancelledSubscriber();
