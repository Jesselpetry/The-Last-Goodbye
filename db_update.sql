-- Add unlock_date column with the default target of 20 Feb 2026 21:00 (GMT+7)
ALTER TABLE friends ADD COLUMN unlock_date TIMESTAMP WITH TIME ZONE DEFAULT '2026-02-20T14:00:00Z';
