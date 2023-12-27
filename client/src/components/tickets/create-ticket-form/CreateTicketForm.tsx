'use client';

import * as actions from '@/actions';
import { Button, Input } from '@nextui-org/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';
import { TicketFormState } from '@/types/form-types';

export default function CreateTicketForm() {
  const router = useRouter();
  const [form, setForm] = useState({
    title: '',
    price: '',
  });
  const [errors, setErrors] = useState<TicketFormState['errors']>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formState = await actions.createTicket(form);

    if (formState.success) {
      router.push(paths.home());
    } else {
      setErrors({
        ...formState.errors,
      });
    }
    setIsLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-5 max-w-md w-full"
    >
      <div className="flex flex-col gap-5">
        <Input
          name="title"
          label="Title"
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          labelPlacement="outside"
          placeholder="Title"
          isInvalid={!!errors?.title}
          errorMessage={errors?.title?.join(', ')}
        />
        <Input
          name="price"
          label="Price"
          type="number"
          labelPlacement="outside"
          placeholder="Price"
          value={form.price}
          onChange={(event) => setForm({ ...form, price: event.target.value })}
          isInvalid={!!errors?.price}
          errorMessage={errors?.price?.join(', ')}
        />
      </div>
      {errors?._form ? (
        <div className="p-2 text-sm bg-red-200 border border-red-400">
          {errors._form?.join(', ')}
        </div>
      ) : null}
      <Button type="submit" isLoading={isLoading}>
        {isLoading ? 'Creating...' : 'Create'}
      </Button>
    </form>
  );
}
