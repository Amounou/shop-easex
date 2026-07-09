
-- Drop the view (linter flagged SECURITY DEFINER view)
DROP VIEW IF EXISTS public.stores_public;

-- Public storefront lookup by slug (no sensitive columns)
CREATE OR REPLACE FUNCTION public.get_public_store_by_slug(_slug text)
RETURNS TABLE (
  id uuid,
  owner_id uuid,
  name text,
  slug text,
  logo_url text,
  description text,
  currency text,
  city text,
  country text,
  status text,
  terms_conditions text,
  theme text,
  created_at timestamptz,
  updated_at timestamptz
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT s.id, s.owner_id, s.name, s.slug, s.logo_url, s.description,
         s.currency, s.city, s.country, s.status, s.terms_conditions,
         s.theme, s.created_at, s.updated_at
  FROM public.stores s
  WHERE s.slug = _slug AND s.status = 'active'
  LIMIT 1;
$$;

REVOKE EXECUTE ON FUNCTION public.get_public_store_by_slug(text) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_public_store_by_slug(text) TO anon, authenticated;
