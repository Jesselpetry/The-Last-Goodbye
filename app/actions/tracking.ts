'use server';

import { supabase } from '@/lib/supabase';
import { UAParser } from 'ua-parser-js';

interface VisitData {
  slug: string;
  ip: string;
  userAgent: string;
}

/**
 * Logs a user visit for a specific friend's letter by their slug.
 * It parses the User Agent to gather analytics data like device type,
 * browser (including in-app browsers like LINE/IG), and OS.
 * This is the core function of the "Advanced Analytics (Spy) System".
 *
 * @param data - The visit data containing slug, IP address, and User Agent string.
 */
export async function logVisit(data: VisitData): Promise<void> {
  try {
    // Parse User Agent
    const parser = new UAParser(data.userAgent);
    const result = parser.getResult();
    
    // Get device info
    const deviceType = result.device.type || 'desktop';
    const deviceModel = result.device.model || result.device.vendor || 'Unknown';
    
    // Get browser info - detect in-app browsers
    let browser = result.browser.name || 'Unknown';
    const ua = data.userAgent.toLowerCase();
    
    if (ua.includes('line')) {
      browser = 'Line';
    } else if (ua.includes('instagram')) {
      browser = 'Instagram';
    } else if (ua.includes('fban') || ua.includes('fbav')) {
      browser = 'Facebook';
    } else if (ua.includes('twitter')) {
      browser = 'Twitter';
    }
    
    // Get OS info
    const os = result.os.name 
      ? `${result.os.name}${result.os.version ? ' ' + result.os.version : ''}`
      : 'Unknown';
    
    // Get friend ID from slug
    const { data: friend } = await supabase
      .from('friends')
      .select('id')
      .eq('slug', data.slug)
      .single();
    
    if (!friend) {
      console.error('Friend not found for slug:', data.slug);
      return;
    }
    
    // Insert visit log
    await supabase.from('visit_logs').insert({
      friend_id: friend.id,
      ip_address: data.ip,
      user_agent: data.userAgent,
      device_type: deviceType,
      device_model: deviceModel,
      browser: browser,
      os: os,
    });
  } catch (error) {
    console.error('Error logging visit:', error);
  }
}

/**
 * Verifies if the provided passcode matches the friend's actual passcode.
 * This acts as the authentication layer before a user can unlock and read their letter.
 *
 * @param slug - The friend's unique URL identifier.
 * @param passcode - The 4-digit PIN provided by the user.
 * @returns True if the passcode is correct, false otherwise.
 */
export async function verifyPasscode(slug: string, passcode: string): Promise<boolean> {
  try {
    const { data: friend } = await supabase
      .from('friends')
      .select('passcode')
      .eq('slug', slug)
      .single();
    
    return friend?.passcode === passcode;
  } catch (error) {
    console.error('Error verifying passcode:', error);
    return false;
  }
}

/**
 * Updates the friend's status to 'viewed' once they successfully open the letter.
 * This updates the database so the admin knows the letter has been read.
 *
 * @param slug - The friend's unique URL identifier.
 */
export async function markAsViewed(slug: string): Promise<void> {
  try {
    await supabase
      .from('friends')
      .update({ is_viewed: true })
      .eq('slug', slug);
  } catch (error) {
    console.error('Error marking as viewed:', error);
  }
}

/**
 * Fetches a friend's details from the database using their unique slug.
 * This dynamically loads the necessary data (name, passcode, unlock date, etc.)
 * for the Letter component to render.
 *
 * @param slug - The unique URL identifier for the friend.
 * @returns The friend's data object, or null if an error occurs or the friend doesn't exist.
 */
export async function getFriendBySlug(slug: string) {
  try {
    const { data: friend, error } = await supabase
      .from('friends')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) throw error;
    return friend;
  } catch (error) {
    console.error('Error getting friend:', error);
    return null;
  }
}
