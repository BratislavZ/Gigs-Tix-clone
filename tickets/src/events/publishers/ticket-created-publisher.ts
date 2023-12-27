import {
  Publisher,
  TicketCreatedEvent,
  Topics,
} from '@bratislavz/ticketing-common';

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  readonly topic = Topics.TicketCreated;
}
