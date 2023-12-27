'use client';

import Link from 'next/link';
import { paths } from '@/paths';
import LogoutButton from '../logout-button/LogoutButton';
import { User } from '@/types/types';
import { usePathname } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

type Props = {
  currentUser: User | null;
};

export default function HeaderAuth({ currentUser }: Props) {
  const pathname = usePathname();

  const styleLink =
    'border-b border-transparent p-2 hover:border-slate-500 hover:opacity-80';

  const styleLinkSelected = 'border-b border-slate-500';

  return (
    <>
      {currentUser ? (
        <div className="flex items-center gap-10">
          <div className="flex gap-5">
            <Link
              href={paths.ticketNew()}
              className={twMerge(
                styleLink,
                pathname === paths.ticketNew() && styleLinkSelected
              )}
            >
              Sell tickets
            </Link>
            <Link
              href={paths.orders()}
              className={twMerge(
                styleLink,
                pathname === paths.orders() && styleLinkSelected
              )}
            >
              My orders
            </Link>
          </div>
          <LogoutButton />
        </div>
      ) : (
        <div className="flex justify-center items-center gap-4">
          <Link
            href={paths.signIn()}
            className={twMerge(
              styleLink,
              pathname === paths.signIn() && styleLinkSelected
            )}
          >
            Sign In
          </Link>
          <Link
            href={paths.signUp()}
            className={twMerge(
              styleLink,
              pathname === paths.signUp() && styleLinkSelected
            )}
          >
            Sign Up
          </Link>
        </div>
      )}
    </>
  );
}
