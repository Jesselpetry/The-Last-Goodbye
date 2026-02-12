import { getAllFriends } from '@/app/actions/admin';
import FriendsClient from '@/components/FriendsClient';

export const dynamic = 'force-dynamic';

export default async function FriendsPage() {
  const friends = await getAllFriends();
  
  return <FriendsClient initialFriends={friends} />;
}
