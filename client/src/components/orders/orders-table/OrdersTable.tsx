'use client';

import { Order } from '@/types/types';
import OrderRow from './orders-row/OrderRow';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function OrdersTable() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getOrders = async () => {
      setIsLoading(true);
      const response = await axios({
        method: 'GET',
        url: '/api/orders',
        headers: {
          Host: 'ticketing.dev',
        },
      });
      setIsLoading(false);
      setOrders(response.data);
    };
    getOrders();
  }, []);

  return (
    <div className="px-10">
      {orders?.length > 0 ? (
        <div className="border border-slate-300 rounded-lg overflow-hidden">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-200 text-left">
                <th className="py-2 px-4">Ticket</th>
                <th className="py-2 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <OrderRow key={order.id} order={order} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex items-center justify-center text-2xl font-semibold border-2 border-gray-300 w-full h-96 rounded-lg bg-gray-100">
          {isLoading ? 'Loading...' : 'No orders'}
        </div>
      )}
    </div>
  );
}
