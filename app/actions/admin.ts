'use server';

import { supabase } from '@/lib/supabase';
import { Friend, FriendFormData, FriendWithStatus, VisitLog, VisitLogWithFriend } from '@/lib/types';

// Get all friends with status
export async function getAllFriends(): Promise<FriendWithStatus[]> {
  try {
    const { data: friends, error } = await supabase
      .from('friends')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    // Get visit counts for each friend
    const friendsWithStatus: FriendWithStatus[] = await Promise.all(
      (friends || []).map(async (friend: Friend) => {
        const { count } = await supabase
          .from('visit_logs')
          .select('*', { count: 'exact', head: true })
          .eq('friend_id', friend.id);
        
        let status: 'locked' | 'viewed' | 'scanned';
        if (friend.is_viewed) {
          status = 'viewed';
        } else if ((count || 0) > 0) {
          status = 'scanned';
        } else {
          status = 'locked';
        }
        
        return {
          ...friend,
          status,
          visit_count: count || 0,
        };
      })
    );
    
    return friendsWithStatus;
  } catch (error) {
    console.error('Error getting friends:', error);
    return [];
  }
}

// Get visit logs for a specific friend
export async function getVisitLogs(friendId: string): Promise<VisitLog[]> {
  try {
    const { data: logs, error } = await supabase
      .from('visit_logs')
      .select('*')
      .eq('friend_id', friendId)
      .order('visited_at', { ascending: false });
    
    if (error) throw error;
    return logs || [];
  } catch (error) {
    console.error('Error getting visit logs:', error);
    return [];
  }
}

// Get all visit logs with friend info
export async function getAllVisitLogs(): Promise<VisitLogWithFriend[]> {
  try {
    const { data: logs, error } = await supabase
      .from('visit_logs')
      .select(`
        *,
        friends (
          id,
          name,
          slug
        )
      `)
      .order('visited_at', { ascending: false });
    
    if (error) throw error;
    return (logs || []) as VisitLogWithFriend[];
  } catch (error) {
    console.error('Error getting all visit logs:', error);
    return [];
  }
}

// Create a new friend
export async function createFriend(data: FriendFormData): Promise<Friend | null> {
  try {
    const { data: friend, error } = await supabase
      .from('friends')
      .insert({
        name: data.name,
        slug: data.slug,
        passcode: data.passcode,
        content: data.content,
        image_url: data.image_url || null,
      })
      .select()
      .single();
    
    if (error) throw error;
    return friend;
  } catch (error) {
    console.error('Error creating friend:', error);
    return null;
  }
}

// Update a friend
export async function updateFriend(id: string, data: Partial<FriendFormData>): Promise<Friend | null> {
  try {
    const { data: friend, error } = await supabase
      .from('friends')
      .update(data)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return friend;
  } catch (error) {
    console.error('Error updating friend:', error);
    return null;
  }
}

// Delete a friend
export async function deleteFriend(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from('friends')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error deleting friend:', error);
    return false;
  }
}

// Get a single friend by ID
export async function getFriendById(id: string): Promise<Friend | null> {
  try {
    const { data: friend, error } = await supabase
      .from('friends')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return friend;
  } catch (error) {
    console.error('Error getting friend:', error);
    return null;
  }
}
