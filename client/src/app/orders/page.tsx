import { getCurrentUser } from '@/api/auth';
import OrdersTable from '@/components/orders/orders-table/OrdersTable';
import { paths } from '@/paths';
import { redirect } from 'next/navigation';

export default async function OrdersPage() {
  const user = await getCurrentUser();

  if (!user || !user.currentUser) {
    redirect(paths.home());
  }

  return (
    <div className="flex flex-col gap-10">
      <h1 className="text-4xl font-bold">Orders</h1>
      <OrdersTable />
    </div>
  );
}
