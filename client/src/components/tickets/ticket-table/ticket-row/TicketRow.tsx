import { Ticket } from '@/types/types';
import Link from 'next/link';

type Props = {
  ticket: Ticket;
};

export default function TicketRow({ ticket }: Props) {
  return (
    <tr className="border-b border-gray-200 hover:bg-gray-100 last:border-none">
      <td className="py-2 px-4">{ticket.title}</td>
      <td className="py-2 px-4">{ticket.price}</td>
      <td className="py-2 px-4">
        <Link href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>
          View
        </Link>
      </td>
    </tr>
  );
}
