'use client';
import { Button, Input } from '@nextui-org/react';
import { AuthFormState } from '@/types/form-types';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { paths } from '@/paths';

type Props = {
  buttonText: string;
  serverAction: (form: {
    email: string;
    password: string;
  }) => Promise<AuthFormState>;
};

export default function AuthForm({ buttonText, serverAction }: Props) {
  const router = useRouter();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<AuthFormState['errors']>({});
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const formState = await serverAction(form);

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
          name="email"
          label="Email"
          labelPlacement="outside"
          placeholder="Email"
          value={form.email}
          onChange={(event) => setForm({ ...form, email: event.target.value })}
          isInvalid={!!errors?.email}
          errorMessage={errors?.email?.join(', ')}
        />
        <Input
          name="password"
          label="Password"
          value={form.password}
          onChange={(event) =>
            setForm({ ...form, password: event.target.value })
          }
          labelPlacement="outside"
          placeholder="Password"
          type="password"
          isInvalid={!!errors?.email}
          errorMessage={errors?.email?.join(', ')}
        />
      </div>
      {errors?._form ? (
        <div className="p-2 text-sm bg-red-200 border border-red-400">
          {errors._form?.join(', ')}
        </div>
      ) : null}
      <Button isLoading={isLoading} type="submit">
        {isLoading ? 'Loading...' : buttonText}
      </Button>
    </form>
  );
}
