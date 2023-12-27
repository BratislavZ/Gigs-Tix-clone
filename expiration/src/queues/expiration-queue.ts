import Queue from 'bull';
import { ExpirationCompletePublisher } from '../events/publishers/expiration-complete-event';
import { producer } from '../kafka';

interface Payload {
  orderId: string;
}

const expirationQueue = new Queue<Payload>('order:expiration', {
  redis: {
    host: process.env.REDIS_HOST,
  },
});

expirationQueue.process(async (job) => {
  new ExpirationCompletePublisher(producer).publish({
    orderId: job.data.orderId,
  });
});

export { expirationQueue };
