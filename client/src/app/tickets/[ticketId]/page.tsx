import { getTicket } from '@/api/tickets';
import CreateOrderForm from '@/components/orders/create-order-form/CreateOrderForm';

type Props = {
  params: {
    ticketId: string;
  };
};

export default async function TicketPage({ params }: Props) {
  const { ticketId } = params;

  const ticket = await getTicket(ticketId);

  if (!ticket) {
    return <div>Ticket not found.</div>;
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-2">
        <div className="text-sm text-slate-400 font-semibold">Name</div>
        <div>{ticket.title}</div>
      </div>
      <div className="flex flex-col gap-2">
        <div className="text-sm text-slate-400 font-semibold">Price</div>
        <div>{ticket.price} $</div>
      </div>
      <CreateOrderForm ticketId={ticket.id} />
    </div>
  );
}
