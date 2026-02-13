// Database Types for The Last Goodbye

export interface Friend {
  id: string;
  created_at: string;
  slug: string;
  name: string;
  passcode: string;
  content: string | null;
  image_url?: string | null; // Deprecated, use image_urls
  image_urls: string[] | null; // New field
  spotify_url: string | null; // New field
  bgm_url?: string | null; // New field
  is_viewed: boolean;
  unlock_date: string | null; // New field
  updated_at?: string;
}

export interface Reply {
  id: string;
  friend_id: string;
  content: string;
  sender_name?: string | null;
  is_read: boolean;
  created_at: string;
}

export interface VisitLog {
  id: string;
  friend_id: string;
  visited_at: string;
  ip_address: string | null;
  user_agent: string | null;
  device_type: string | null;
  device_model: string | null;
  browser: string | null;
  os: string | null;
}

// Visit log with friend relation (from Supabase join)
export interface VisitLogWithFriend extends VisitLog {
  friends: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface ReplyWithFriend extends Reply {
  friends: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

export interface FriendWithLogs extends Friend {
  visit_logs: VisitLog[];
}

// Form types
export interface FriendFormData {
  name: string;
  slug: string;
  passcode: string;
  content: string;
  image_urls?: string[];
  spotify_url?: string;
  bgm_url?: string; // New field
  image_url?: string; // Deprecated
  unlock_date?: string; // New field
}

// Status types for admin dashboard
export type FriendStatus = 'locked' | 'viewed' | 'scanned';

export interface FriendWithStatus extends Friend {
  status: FriendStatus;
  visit_count: number;
}
