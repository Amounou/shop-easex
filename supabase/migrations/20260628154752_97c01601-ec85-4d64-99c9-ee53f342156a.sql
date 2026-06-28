
DROP POLICY IF EXISTS "Owners can read own store logos" ON storage.objects;
CREATE POLICY "Public can read store logos" ON storage.objects FOR SELECT TO anon, authenticated
  USING (bucket_id = 'store-logos');
