import { getCurrentUser } from '@/api/auth';
import CreateTicketForm from '@/components/tickets/create-ticket-form/CreateTicketForm';
import { paths } from '@/paths';
import { redirect } from 'next/navigation';

export default async function TicketPage() {
  const user = await getCurrentUser();

  if (!user || !user.currentUser) {
    redirect(paths.home());
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <h1 className="text-4xl font-bold">Create new Ticket</h1>
      <CreateTicketForm />
    </div>
  );
}
