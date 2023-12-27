import express, { Request, Response } from 'express';
import { Order, OrderStatus } from '../models/order';
import {
  NotAuthorizedError,
  NotFoundError,
  requireAuth,
} from '@bratislavz/ticketing-common';
import { OrderCancelledPublisher } from '../events/publishers/order-cancelled-publisher';
import { producer } from '../kafka';

const router = express.Router();

// here we could use patch
router.delete(
  '/api/orders/:orderId',
  requireAuth,
  async (req: Request, res: Response) => {
    const { orderId } = req.params;

    const order = await Order.findById(orderId).populate('ticket');
    if (!order) {
      throw new NotFoundError();
    }

    if (order.userId !== req.currentUser!.id) {
      throw new NotAuthorizedError();
    }

    order.status = OrderStatus.Cancelled;
    await order.save();

    // publishing an event saying this was cancelled
    await new OrderCancelledPublisher(producer).publish({
      id: order.id,
      version: order.version,
      ticket: {
        id: order.ticket.id,
      },
    });

    res.status(204).send(order);
  }
);

export { router as deleteOrderRouter };
