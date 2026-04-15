
-- Allow authenticated users to insert their own store subscriptions
CREATE POLICY "Store owners can create subscriptions"
ON public.store_subscriptions
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM stores
    WHERE stores.id = store_subscriptions.store_id
    AND stores.owner_id = auth.uid()
  )
);

-- Allow authenticated users to insert their own merchant role
CREATE POLICY "Users can insert own role"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);
