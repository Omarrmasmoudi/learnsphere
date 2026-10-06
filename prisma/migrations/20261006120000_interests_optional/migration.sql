-- schema.prisma declares `interests String?`, but 20250521005622_interests made the
-- column NOT NULL, so registering without interests failed with a 500.
ALTER TABLE "User" ALTER COLUMN "interests" DROP NOT NULL;
