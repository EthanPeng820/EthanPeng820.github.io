-- 为 links 表添加分类、简介、收录时间、访问统计、回收站和管理员 RLS；可重复执行。
ALTER TABLE public.links
ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'all';

ALTER TABLE public.links
ADD COLUMN IF NOT EXISTS description text;

ALTER TABLE public.links
ADD COLUMN IF NOT EXISTS created_at timestamptz NOT NULL DEFAULT now();

ALTER TABLE public.links
ADD COLUMN IF NOT EXISTS click_count bigint NOT NULL DEFAULT 0;

ALTER TABLE public.links
ADD COLUMN IF NOT EXISTS deleted_at timestamptz;

UPDATE public.links SET created_at = now() WHERE created_at IS NULL;
UPDATE public.links SET click_count = 0 WHERE click_count IS NULL;

ALTER TABLE public.links
ALTER COLUMN created_at SET DEFAULT now(),
ALTER COLUMN created_at SET NOT NULL,
ALTER COLUMN click_count SET DEFAULT 0,
ALTER COLUMN click_count SET NOT NULL;

ALTER TABLE public.links ENABLE ROW LEVEL SECURITY;

-- RLS policies are permissive by default, so old broad policies must not remain.
DO $$
DECLARE
  existing_policy record;
BEGIN
  FOR existing_policy IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'links'
  LOOP
    EXECUTE format('DROP POLICY %I ON public.links', existing_policy.policyname);
  END LOOP;
END
$$;

CREATE POLICY links_read_active_or_admin
ON public.links
FOR SELECT
TO anon, authenticated
USING (
  deleted_at IS NULL
  OR lower(coalesce(auth.jwt() ->> 'email', '')) = lower('EthanPeng820@163.com')
);

CREATE POLICY links_admin_insert
ON public.links
FOR INSERT
TO authenticated
WITH CHECK (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('EthanPeng820@163.com')
);

CREATE POLICY links_admin_update
ON public.links
FOR UPDATE
TO authenticated
USING (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('EthanPeng820@163.com')
)
WITH CHECK (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('EthanPeng820@163.com')
);

CREATE POLICY links_admin_delete
ON public.links
FOR DELETE
TO authenticated
USING (
  lower(coalesce(auth.jwt() ->> 'email', '')) = lower('EthanPeng820@163.com')
);

REVOKE ALL ON public.links FROM PUBLIC, anon, authenticated;
GRANT SELECT ON public.links TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.links TO authenticated;

DO $$
DECLARE
  links_id_sequence text;
BEGIN
  links_id_sequence := pg_get_serial_sequence('public.links', 'id');
  IF links_id_sequence IS NOT NULL THEN
    EXECUTE format(
      'REVOKE ALL ON SEQUENCE %s FROM PUBLIC, anon, authenticated',
      links_id_sequence
    );
    EXECUTE format(
      'GRANT USAGE, SELECT ON SEQUENCE %s TO authenticated',
      links_id_sequence
    );
  END IF;
END
$$;

CREATE OR REPLACE FUNCTION public.increment_link_click(link_id bigint)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $function$
BEGIN
  UPDATE public.links
  SET click_count = click_count + 1
  WHERE public.links.id = link_id AND deleted_at IS NULL;
  RETURN FOUND;
END;
$function$;

REVOKE ALL ON FUNCTION public.increment_link_click(bigint) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.increment_link_click(bigint) TO anon, authenticated;
