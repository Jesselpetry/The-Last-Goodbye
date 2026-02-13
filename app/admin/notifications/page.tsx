import { getAllReplies } from '@/app/actions/replies';
import NotificationsClient from '@/components/NotificationsClient';

export const dynamic = 'force-dynamic';

export default async function NotificationsPage() {
  const replies = await getAllReplies();
  // Ensure that we handle the case where replies might be null if there is an error
  const safeReplies = replies || [];

  return <NotificationsClient initialReplies={safeReplies} />;
}
