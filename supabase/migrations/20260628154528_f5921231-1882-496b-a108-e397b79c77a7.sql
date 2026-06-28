
-- profiles: owner-only SELECT
DROP POLICY IF EXISTS "Profiles viewable by everyone" ON public.profiles;
CREATE POLICY "Users can view own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);

-- user_roles: remove self-insert
DROP POLICY IF EXISTS "Users can insert own role" ON public.user_roles;

-- stores: hide contact details from anonymous callers
REVOKE SELECT (email, phone, address) ON public.stores FROM anon;

-- coupons: restrict reads to owners/admins
DROP POLICY IF EXISTS "Active coupons are public" ON public.coupons;
CREATE POLICY "Owners view coupons" ON public.coupons FOR SELECT USING (
  (EXISTS (SELECT 1 FROM public.stores s WHERE s.id = coupons.store_id AND s.owner_id = auth.uid()))
  OR public.has_role(auth.uid(), 'admin'::app_role)
);

-- orders: tighten INSERT - require active store and matching customer (or null guest)
DROP POLICY IF EXISTS "Customers can create orders" ON public.orders;
CREATE POLICY "Customers can create orders" ON public.orders FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.stores s WHERE s.id = orders.store_id AND s.status = 'active')
  AND (
    (auth.uid() IS NOT NULL AND auth.uid() = customer_id)
    OR (auth.uid() IS NULL AND customer_id IS NULL)
  )
);

-- Revoke EXECUTE on internal trigger SECURITY DEFINER functions
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM anon, authenticated, PUBLIC;
REVOKE EXECUTE ON FUNCTION public.generate_order_number() FROM anon, authenticated, PUBLIC;
-- has_role must stay executable for RLS policy evaluation by authenticated users; revoke from anon
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM anon, PUBLIC;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated;
