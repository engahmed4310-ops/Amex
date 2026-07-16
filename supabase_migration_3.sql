-- ============================================================
-- Migration 3 — self-chosen PIN at sign-up
-- Run in SQL Editor → New query → Run
-- ============================================================
alter table pending_signups add column if not exists pin text;
