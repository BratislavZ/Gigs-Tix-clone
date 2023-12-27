import { paths } from '@/paths';
import Link from 'next/link';
import HeaderAuth from './HeaderAuth';
import { getCurrentUser } from '@/api/auth';

export default async function Header() {
  const data = await getCurrentUser();

  return (
    <div className="border-b-2 border-stone-400 flex justify-between items-center p-2 bg-stone-300">
      <Link href={paths.home()} className="font-semibold text-3xl p-2">
        Ticketino
      </Link>
      <HeaderAuth currentUser={data.currentUser} />
    </div>
  );
}
