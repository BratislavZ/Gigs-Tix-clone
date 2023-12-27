import {
  OrderCancelledEvent,
  Publisher,
  Topics,
} from '@bratislavz/ticketing-common';

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  readonly topic = Topics.OrderCancelled;
}
