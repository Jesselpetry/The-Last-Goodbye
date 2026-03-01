'use server';

import { supabase } from '@/lib/supabase';
import { Friend, FriendFormData, FriendWithStatus, VisitLog, VisitLogWithFriend } from '@/lib/types';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';

// Verify Admin PIN
export async function verifyAdmin(pin: string) {
  const adminPin = process.env.ADMIN_PIN;

  if (!adminPin) {
    console.error("ADMIN_PIN not set");
    return { success: false, error: "System configuration error" };
  }

  if (pin === adminPin) {
    const cookieStore = await cookies();
    cookieStore.set('admin_session', 'authenticated', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 // 1 day,
    });
    return { success: true };
  }

  return { success: false, error: "Invalid PIN" };
}

// Logout Admin
export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/admin/login');
}

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
        image_urls: data.image_urls || [],
        spotify_url: data.spotify_url || null,
        bgm_url: data.bgm_url || null,
        unlock_date: data.unlock_date || null,
      })
      .select()
      .single();
    
    if (error) throw error;

    revalidatePath('/admin/friends');
    revalidatePath('/');

    return friend;
  } catch (error) {
    console.error('Error creating friend:', error);
    return null;
  }
}

// Update a friend
export async function updateFriend(id: string, data: Partial<FriendFormData>): Promise<Friend | null> {
  try {
    // Only pick fields that exist in the form and database
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const updateData: any = {
        name: data.name,
        slug: data.slug,
        passcode: data.passcode,
        content: data.content,
    };

    if (data.image_urls !== undefined) updateData.image_urls = data.image_urls;
    if (data.spotify_url !== undefined) updateData.spotify_url = data.spotify_url;
    if (data.bgm_url !== undefined) updateData.bgm_url = data.bgm_url;
    if (data.unlock_date !== undefined) updateData.unlock_date = data.unlock_date;

    const { data: friend, error } = await supabase
      .from('friends')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;

    revalidatePath('/admin/friends');
    revalidatePath(`/${friend.slug}`);
    revalidatePath('/');

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

    revalidatePath('/admin/friends');
    revalidatePath('/');

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
