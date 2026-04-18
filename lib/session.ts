import { getServerSession } from 'next-auth';
import { authOptions } from './auth';
import { cookies } from 'next/headers';

export async function getUserId() {
  const session = await getServerSession(authOptions);
  if (session?.user) {
    return (session.user as any).id;
  }
  
  const guestId = cookies().get('playerone_guest_id')?.value;
  return guestId || null;
}
