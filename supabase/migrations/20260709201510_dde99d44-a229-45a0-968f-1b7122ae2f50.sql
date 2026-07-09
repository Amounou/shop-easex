
CREATE POLICY "Public read product-images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Store owners upload product-images" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'product-images' AND (storage.foldername(name))[1] IN (SELECT id::text FROM public.stores WHERE owner_id = auth.uid()));
CREATE POLICY "Store owners update product-images" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'product-images' AND (storage.foldername(name))[1] IN (SELECT id::text FROM public.stores WHERE owner_id = auth.uid()));
CREATE POLICY "Store owners delete product-images" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'product-images' AND (storage.foldername(name))[1] IN (SELECT id::text FROM public.stores WHERE owner_id = auth.uid()));
