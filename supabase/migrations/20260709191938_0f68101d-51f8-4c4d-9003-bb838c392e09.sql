
DROP POLICY IF EXISTS "Shipping zones are public" ON public.shipping_zones;

CREATE POLICY "Shipping zones of active stores are public"
ON public.shipping_zones
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.stores s
    WHERE s.id = shipping_zones.store_id AND s.status = 'active'
  )
  OR EXISTS (
    SELECT 1 FROM public.stores s
    WHERE s.id = shipping_zones.store_id AND s.owner_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
);
