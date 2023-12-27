import {
  OrderCreatedEvent,
  Publisher,
  Topics,
} from '@bratislavz/ticketing-common';

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  readonly topic = Topics.OrderCreated;
}
