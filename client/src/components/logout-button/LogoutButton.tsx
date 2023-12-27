'use client';

import { Button } from '@nextui-org/react';
import * as actions from '@/actions';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { paths } from '@/paths';

export default function LogoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);

    const data = await actions.logout();
    if (data.success) {
      router.replace(paths.home());
    }

    setIsLoading(false);
  }

  return (
    <form onSubmit={onSubmit}>
      <Button
        isLoading={isLoading}
        type="submit"
        className="bg-slate-800 text-white"
      >
        Logout
      </Button>
    </form>
  );
}
