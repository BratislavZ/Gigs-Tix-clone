import { Order } from '@/types/types';
import Link from 'next/link';
import React from 'react';
import { twMerge } from 'tailwind-merge';

type Props = {
  order: Order;
};

export default function OrderRow({ order }: Props) {
  const { ticket, status } = order;

  return (
    <tr className="border-b border-gray-200 hover:bg-gray-100 last:border-none">
      <td className="py-2 px-4">{ticket.title}</td>
      <td
        className={twMerge(
          'py-2 px-4',
          status === 'complete' ? 'text-green-500' : '',
          status === 'cancelled' ? 'text-red-500' : ''
        )}
      >
        {status}
      </td>
    </tr>
  );
}
