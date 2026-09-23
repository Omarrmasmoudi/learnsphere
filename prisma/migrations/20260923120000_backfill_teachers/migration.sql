-- Anyone who already authored a course keeps access to the teacher area
-- now that it requires the TEACHER role.
INSERT INTO "Teacher" ("userId")
SELECT DISTINCT "instructorId" FROM "courses"
ON CONFLICT ("userId") DO NOTHING;
