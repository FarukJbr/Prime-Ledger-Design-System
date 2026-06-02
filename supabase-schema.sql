-- ============================================================
--  PRIME LEDGER — Supabase setup (supabase-schema.sql)
--  ------------------------------------------------------------
--  הריצו את כל הקובץ הזה פעם אחת בתוך Supabase:
--    Dashboard → SQL Editor → New query → הדביקו → Run.
--  הוא יוצר את טבלת הלקוחות, הרשאות אבטחה (RLS), טבלת מנהלים,
--  וטריגר שמקשר הרשמה חדשה לפרופיל לקוח.
-- ============================================================

-- ---------- 1. טבלת מנהלים ----------
create table if not exists public.admins (
  email text primary key
);
-- הזינו כאן את כתובות האימייל של המנהלים (כמו ב‑config.js):
insert into public.admins (email) values ('info@primels.co.il')
  on conflict (email) do nothing;

-- פונקציית עזר: האם המשתמש המחובר הוא מנהל?
create or replace function public.is_admin()
returns boolean
language sql security definer stable
as $$
  select exists (
    select 1 from public.admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;

-- ---------- 2. טבלת לקוחות ----------
create table if not exists public.clients (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid references auth.users(id) on delete set null,
  full_name   text not null default '',
  business    text default '',
  email       text not null,
  phone       text default '',
  tax_id      text default '',
  tier        text default 'בסיס',
  status      text not null default 'active',   -- active | blocked | invited
  notes       text default '',
  created_at  timestamptz not null default now()
);
create unique index if not exists clients_email_key on public.clients (lower(email));

alter table public.clients enable row level security;

-- ---------- 3. הרשאות (RLS) ----------
-- לקוח רואה ועורך רק את הפרופיל של עצמו (לפי האימייל שלו).
drop policy if exists "client reads own" on public.clients;
create policy "client reads own" on public.clients
  for select using (
    lower(email) = lower(coalesce(auth.jwt() ->> 'email','')) or public.is_admin()
  );

drop policy if exists "client updates own" on public.clients;
create policy "client updates own" on public.clients
  for update using (
    lower(email) = lower(coalesce(auth.jwt() ->> 'email','')) or public.is_admin()
  );

-- מנהל יכול להוסיף / למחוק לקוחות.
drop policy if exists "admin inserts" on public.clients;
create policy "admin inserts" on public.clients
  for insert with check (public.is_admin());

drop policy if exists "admin deletes" on public.clients;
create policy "admin deletes" on public.clients
  for delete using (public.is_admin());

-- ---------- 4. טריגר: יצירת/קישור פרופיל בהרשמה ----------
-- כשמשתמש חדש נרשם, נוצר (או מתעדכן) פרופיל לקוח עם הפרטים שמילא.
create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer
as $$
begin
  insert into public.clients (user_id, email, full_name, business, phone, tax_id, tier, status)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', ''),
    coalesce(new.raw_user_meta_data ->> 'business', ''),
    coalesce(new.raw_user_meta_data ->> 'phone', ''),
    coalesce(new.raw_user_meta_data ->> 'tax_id', ''),
    coalesce(new.raw_user_meta_data ->> 'tier', 'בסיס'),
    'active'
  )
  on conflict (lower(email)) do update
    set user_id   = excluded.user_id,
        full_name = case when public.clients.full_name = '' then excluded.full_name else public.clients.full_name end,
        status    = case when public.clients.status = 'invited' then 'active' else public.clients.status end;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================
--  זהו! עכשיו:
--   • לקוח שנרשם באתר → נוצר לו פרופיל אוטומטית.
--   • מנהל (אימייל ברשימת admins) → רואה ומנהל את כל הלקוחות.
--   • לקוח חסום (status='blocked') → הקוד באתר חוסם את הכניסה.
-- ============================================================
