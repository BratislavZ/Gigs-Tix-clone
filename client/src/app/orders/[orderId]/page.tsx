import { getCurrentUser } from '@/api/auth';
import { getOrder } from '@/api/orders';
import OrderShow from '@/components/orders/show-order/ShowOrder';
import { paths } from '@/paths';
import { redirect } from 'next/navigation';

type Props = {
  params: {
    orderId: string;
  };
};

export default async function OrderPage({ params }: Props) {
  const { orderId } = params;

  const [order, user] = await Promise.all([
    getOrder(orderId),
    getCurrentUser(),
  ]);

  if (!user || !user.currentUser) {
    redirect(paths.home());
  }

  return <OrderShow order={order} currentUser={user.currentUser} />;
}
