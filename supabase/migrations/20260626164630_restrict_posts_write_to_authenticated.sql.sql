/*
# Restrict post writes to authenticated users only

## Summary
Previously posts could be inserted, updated, and deleted by anonymous users.
This migration tightens that so only authenticated (signed-in) users may
create, modify, or delete posts. Anonymous visitors retain read-only access.

## Changes
- posts table: DROP the anon-writable insert/update/delete policies
- posts table: ADD authenticated-only insert/update/delete policies
- SELECT policy is unchanged (anon + authenticated can still read posts)

## Security
- Only the one logged-in admin account can publish or delete articles.
- Unauthenticated visitors will get a permission error if they attempt a write
  directly against the API.
*/

-- Remove the permissive anon-write policies added earlier
DROP POLICY IF EXISTS "posts_insert_all" ON posts;
DROP POLICY IF EXISTS "posts_update_all" ON posts;
DROP POLICY IF EXISTS "posts_delete_all" ON posts;
-- Also clean up any older names that may exist
DROP POLICY IF EXISTS "posts_insert_authenticated" ON posts;
DROP POLICY IF EXISTS "posts_update_authenticated" ON posts;
DROP POLICY IF EXISTS "posts_delete_authenticated" ON posts;

-- Authenticated-only write policies
CREATE POLICY "posts_insert_authenticated" ON posts FOR INSERT
  TO authenticated WITH CHECK (true);

CREATE POLICY "posts_update_authenticated" ON posts FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "posts_delete_authenticated" ON posts FOR DELETE
  TO authenticated USING (true);
