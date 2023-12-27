import { Ticket } from '@/types/types';
import TicketRow from './ticket-row/TicketRow';
import { getTickets } from '@/api/tickets';

export default async function TicketTable() {
  const tickets = await getTickets();

  return (
    <div className="px-10">
      {tickets?.length > 0 ? (
        <div className="border border-slate-300 rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="py-2 px-4">Title</th>
                <th className="py-2 px-4">Price</th>
                <th className="py-2 px-4">Link</th>
              </tr>
            </thead>
            <tbody>
              {tickets.map((ticket: Ticket) => (
                <TicketRow key={ticket.id} ticket={ticket} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center justify-center text-2xl font-semibold border-2 border-gray-300 w-full h-96 rounded-lg bg-gray-100">
          No tickets
        </div>
      )}
    </div>
  );
}
