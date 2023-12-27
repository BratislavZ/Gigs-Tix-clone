import TicketTable from '@/components/tickets/ticket-table/TicketTable';

export default async function Home() {
  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-4xl font-bold">Tickets</h1>
      <TicketTable />
    </div>
  );
}
