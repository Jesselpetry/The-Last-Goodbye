'use server';

import { supabase } from '@/lib/supabase';
import { UAParser } from 'ua-parser-js';

interface VisitData {
  slug: string;
  ip: string;
  userAgent: string;
}

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
