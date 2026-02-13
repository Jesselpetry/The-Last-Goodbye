-- Add bgm_url column to friends table
ALTER TABLE friends ADD COLUMN bgm_url TEXT DEFAULT NULL;

-- Create replies table for friend responses
CREATE TABLE replies (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  friend_id UUID REFERENCES friends(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  sender_name TEXT, -- Optional custom name
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for faster queries
CREATE INDEX idx_replies_friend_id ON replies(friend_id);
CREATE INDEX idx_replies_is_read ON replies(is_read);
