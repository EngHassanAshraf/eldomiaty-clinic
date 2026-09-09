-- Backfill existing null phones before making the column required
UPDATE "users" SET "phone" = '' WHERE "phone" IS NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "phone" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN "email_verified" BOOLEAN NOT NULL DEFAULT false;
ALTER TABLE "users" ADD COLUMN "phone_verified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE INDEX "users_email_verified_idx" ON "users"("email_verified");
CREATE INDEX "users_phone_verified_idx" ON "users"("phone_verified");
