
-- 1. Public stores view without sensitive contact columns
CREATE OR REPLACE VIEW public.stores_public AS
SELECT id, owner_id, name, slug, logo_url, description, currency,
       city, country, status, terms_conditions, theme, created_at, updated_at
FROM public.stores
WHERE status = 'active';

GRANT SELECT ON public.stores_public TO anon, authenticated;

-- Restrict base stores SELECT to owner/admin
DROP POLICY IF EXISTS "Active stores are public" ON public.stores;
CREATE POLICY "Owners and admins view stores"
ON public.stores
FOR SELECT
USING (auth.uid() = owner_id OR public.has_role(auth.uid(), 'admin'));

-- 2. Allow guests to insert order items for their guest order
DROP POLICY IF EXISTS "Customers can insert order items" ON public.order_items;
CREATE POLICY "Customers can insert order items"
ON public.order_items
FOR INSERT
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.orders o
    WHERE o.id = order_items.order_id
      AND (
        (auth.uid() IS NOT NULL AND o.customer_id = auth.uid())
        OR (auth.uid() IS NULL AND o.customer_id IS NULL)
      )
  )
);

-- 3. Guest order retrieval via order_number (SECURITY DEFINER RPC)
CREATE OR REPLACE FUNCTION public.get_guest_order_by_number(_order_number text)
RETURNS TABLE (
  id uuid,
  order_number text,
  status text,
  payment_status text,
  subtotal numeric,
  total numeric,
  shipping_name text,
  shipping_city text,
  shipping_country text,
  created_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT o.id, o.order_number, o.status, o.payment_status,
         o.subtotal, o.total, o.shipping_name, o.shipping_city,
         o.shipping_country, o.created_at
  FROM public.orders o
  WHERE o.order_number = _order_number
    AND o.customer_id IS NULL
  LIMIT 1;
$$;

REVOKE EXECUTE ON FUNCTION public.get_guest_order_by_number(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_guest_order_by_number(text) TO anon, authenticated;
