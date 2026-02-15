'use server';

import { supabase } from '@/lib/supabase';
import { Reply, ReplyWithFriend } from '@/lib/types';

// Create a new reply (Public)
export async function createReply(
  friendId: string,
  content: string,
  senderName?: string,
  isPrivate: boolean = false
): Promise<{ success: boolean; error?: string }> {
  try {
    const { error } = await supabase
      .from('replies')
      .insert({
        friend_id: friendId,
        content: content,
        sender_name: senderName || null,
        is_read: false,
        is_private: isPrivate,
      });

    if (error) {
        console.error('Supabase error:', error);
        throw error;
    }
    return { success: true };
  } catch (error) {
    console.error('Error creating reply:', error);
    return { success: false, error: 'Failed to send reply' };
  }
}

// Get replies for a specific friend (Public - for the feed)
export async function getReplies(friendId: string): Promise<Reply[]> {
  try {
    const { data, error } = await supabase
      .from('replies')
      .select('*')
      .eq('friend_id', friendId)
      .eq('is_private', false) // Only fetch public replies
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error getting replies:', error);
    return [];
  }
}

// Get count of unread replies (Admin)
export async function getUnreadRepliesCount(): Promise<number> {
  try {
    const { count, error } = await supabase
      .from('replies')
      .select('*', { count: 'exact', head: true })
      .eq('is_read', false);

    if (error) throw error;
    return count || 0;
  } catch (error) {
    console.error('Error getting unread count:', error);
    return 0;
  }
}

// Get all replies with friend info (Admin)
export async function getAllReplies(): Promise<ReplyWithFriend[]> {
  try {
    const { data, error } = await supabase
      .from('replies')
      .select(`
        *,
        friends (
          id,
          name,
          slug
        )
      `)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return (data || []) as ReplyWithFriend[];
  } catch (error) {
    console.error('Error getting all replies:', error);
    return [];
  }
}

// Mark reply as read (Admin)
export async function markReplyAsRead(replyId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('replies')
      .update({ is_read: true })
      .eq('id', replyId);

    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error marking reply as read:', error);
    return false;
  }
}
