-- Migration V2: Multi-image support and Spotify integration

-- 1. Add image_urls column (array of text)
alter table friends add column image_urls text[] default '{}';

-- 2. Migrate existing data from image_url to image_urls
update friends set image_urls = array[image_url] where image_url is not null;

-- 3. Add spotify_url column
alter table friends add column spotify_url text;

-- Optional: Drop the old image_url column if you are sure
-- alter table friends drop column image_url;
