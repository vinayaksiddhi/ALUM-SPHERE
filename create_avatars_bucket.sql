-- Run this in your Supabase SQL Editor to create the public avatars bucket

-- Insert the bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

-- Set up security policies for the avatars bucket
-- 1. Allow public access to view avatars
CREATE POLICY "Public Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'avatars' );

-- 2. Allow authenticated users to upload avatars
CREATE POLICY "Auth Upload" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK ( bucket_id = 'avatars' );

-- 3. Allow users to update their own avatars
CREATE POLICY "Auth Update" 
ON storage.objects FOR UPDATE 
TO authenticated
USING ( bucket_id = 'avatars' );
