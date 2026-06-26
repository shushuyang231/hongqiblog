-- Allow anon (no-auth blog) to insert and delete posts
DROP POLICY IF EXISTS "posts_insert_authenticated" ON posts;
DROP POLICY IF EXISTS "posts_delete_authenticated" ON posts;
DROP POLICY IF EXISTS "posts_update_authenticated" ON posts;

CREATE POLICY "posts_insert_all" ON posts FOR INSERT
  TO anon, authenticated WITH CHECK (true);
CREATE POLICY "posts_update_all" ON posts FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);
CREATE POLICY "posts_delete_all" ON posts FOR DELETE
  TO anon, authenticated USING (true);
