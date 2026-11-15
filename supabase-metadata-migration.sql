-- 为 links 表保存分类和手动填写的网站简介；可重复执行。
ALTER TABLE public.links
ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'all';

ALTER TABLE public.links
ADD COLUMN IF NOT EXISTS description text;
