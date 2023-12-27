'use client';

import { Button, ButtonProps } from '@nextui-org/react';
import { useFormStatus } from 'react-dom';

type Props = ButtonProps & {
  children: React.ReactNode;
  className?: string;
};

export default function FormButton({ className, children }: Props) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className={className} isLoading={pending}>
      {children}
    </Button>
  );
}
