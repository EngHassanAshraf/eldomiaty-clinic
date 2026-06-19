/*
  Warnings:

  - A unique constraint covering the columns `[method]` on the table `payment_method_settings` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "payment_method_settings_method_is_active_idx";

-- CreateIndex
CREATE UNIQUE INDEX "payment_method_settings_method_key" ON "payment_method_settings"("method");
