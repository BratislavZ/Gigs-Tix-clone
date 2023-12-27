import {
  Topics,
  Publisher,
  PaymentCreatedEvent,
} from '@bratislavz/ticketing-common';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  readonly topic = Topics.PaymentCreated;
}
