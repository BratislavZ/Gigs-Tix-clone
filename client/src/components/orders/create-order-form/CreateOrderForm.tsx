'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as actions from '@/actions';
import { OrderFormState } from '@/types/form-types';
import { paths } from '@/paths';
import { Button } from '@nextui-org/react';

type Props = {
  ticketId: string;
};

export default function CreateOrderForm({ ticketId }: Props) {
  const router = useRouter();
  const [errors, setErrors] = useState<OrderFormState['errors']>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formState = await actions.createOrder(ticketId);
    if (formState.success && formState.orderId) {
      router.push(paths.orderShow(formState.orderId));
    } else {
      setErrors({
        ...formState.errors,
      });
    }
    setIsLoading(false);
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {errors?._form ? (
        <div className="p-2 text-sm bg-red-200 border border-red-400">
          {errors._form?.[0]}
        </div>
      ) : null}
      <Button type="submit" isLoading={isLoading}>
        {isLoading ? 'Loading...' : 'Order'}
      </Button>
    </form>
  );
}
