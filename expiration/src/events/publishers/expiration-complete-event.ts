import {
  ExpirationCompleteEvent,
  Publisher,
  Topics,
} from '@bratislavz/ticketing-common';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  readonly topic = Topics.ExpirationComplete;
}
