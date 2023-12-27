import {
  Publisher,
  Topics,
  TicketUpdatedEvent,
} from '@bratislavz/ticketing-common';

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  readonly topic = Topics.TicketUpdated;
}
