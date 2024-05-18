/*

CREATE POLICY "Enable select for users based on user_id, user_type, and account_id" ON "public"."c"
FOR SELECT
USING (
  ("user".user_id = (SELECT auth.uid()))
  AND
  (SELECT user_type FROM "user" WHERE user_id = (SELECT auth.uid())) = 'Admin'
  AND
  (SELECT account_id FROM "user" WHERE user_id = (SELECT auth.uid())) = account.account_id
);

*/
