-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "Role" AS ENUM ('ADMIN', 'USER');

-- CreateEnum
CREATE TYPE "PaymentMethod" AS ENUM ('BANK_TRANSFER', 'INSTAPAY', 'VODAFONE_CASH', 'ORANGE_CASH', 'ETISALAT_CASH');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(150),
    "email" VARCHAR(320) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "is_paid" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "refresh_token_hash" VARCHAR(128) NOT NULL,
    "device_info" VARCHAR(512),
    "ip_address" VARCHAR(45),
    "expires_at" TIMESTAMP(3) NOT NULL,
    "last_activity_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "storage_path" VARCHAR(1024) NOT NULL,
    "preview_storage_path" VARCHAR(1024),
    "is_paid_content" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_requests" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "screenshot_url" VARCHAR(1024) NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "admin_notes" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "reviewed_by_admin_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "payment_method_settings" (
    "id" TEXT NOT NULL,
    "method" "PaymentMethod" NOT NULL,
    "display_name" VARCHAR(120) NOT NULL,
    "account_name" VARCHAR(255),
    "account_number" VARCHAR(255),
    "instructions" TEXT,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payment_method_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medical_file_access_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "file_id" TEXT NOT NULL,
    "viewed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "medical_file_access_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" VARCHAR(64) NOT NULL,
    "entity_type" VARCHAR(64),
    "entity_id" VARCHAR(64),
    "metadata" JSONB,
    "ip_address" VARCHAR(45),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_settings" (
    "id" TEXT NOT NULL,
    "key" VARCHAR(128) NOT NULL,
    "value" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "system_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "users_is_paid_idx" ON "users"("is_paid");

-- CreateIndex
CREATE INDEX "users_created_at_idx" ON "users"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "user_sessions_refresh_token_hash_key" ON "user_sessions"("refresh_token_hash");

-- CreateIndex
CREATE INDEX "user_sessions_user_id_idx" ON "user_sessions"("user_id");

-- CreateIndex
CREATE INDEX "user_sessions_expires_at_idx" ON "user_sessions"("expires_at");

-- CreateIndex
CREATE INDEX "user_sessions_user_id_expires_at_idx" ON "user_sessions"("user_id", "expires_at");

-- CreateIndex
CREATE UNIQUE INDEX "files_storage_path_key" ON "files"("storage_path");

-- CreateIndex
CREATE INDEX "files_is_paid_content_idx" ON "files"("is_paid_content");

-- CreateIndex
CREATE INDEX "files_created_at_idx" ON "files"("created_at" DESC);

-- CreateIndex
CREATE INDEX "payment_requests_user_id_idx" ON "payment_requests"("user_id");

-- CreateIndex
CREATE INDEX "payment_requests_status_idx" ON "payment_requests"("status");

-- CreateIndex
CREATE INDEX "payment_requests_status_created_at_idx" ON "payment_requests"("status", "created_at" DESC);

-- CreateIndex
CREATE INDEX "payment_requests_user_id_status_idx" ON "payment_requests"("user_id", "status");

-- CreateIndex
CREATE INDEX "payment_requests_method_idx" ON "payment_requests"("method");

-- CreateIndex
CREATE INDEX "payment_requests_reviewed_by_admin_id_idx" ON "payment_requests"("reviewed_by_admin_id");

-- CreateIndex
CREATE UNIQUE INDEX "payment_method_settings_method_key" ON "payment_method_settings"("method");

-- CreateIndex
CREATE INDEX "payment_method_settings_is_active_idx" ON "payment_method_settings"("is_active");

-- CreateIndex
CREATE INDEX "medical_file_access_logs_user_id_idx" ON "medical_file_access_logs"("user_id");

-- CreateIndex
CREATE INDEX "medical_file_access_logs_file_id_idx" ON "medical_file_access_logs"("file_id");

-- CreateIndex
CREATE INDEX "medical_file_access_logs_viewed_at_idx" ON "medical_file_access_logs"("viewed_at" DESC);

-- CreateIndex
CREATE INDEX "medical_file_access_logs_user_id_file_id_idx" ON "medical_file_access_logs"("user_id", "file_id");

-- CreateIndex
CREATE INDEX "medical_file_access_logs_user_id_viewed_at_idx" ON "medical_file_access_logs"("user_id", "viewed_at" DESC);

-- CreateIndex
CREATE INDEX "audit_logs_user_id_idx" ON "audit_logs"("user_id");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_entity_type_entity_id_idx" ON "audit_logs"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "audit_logs_created_at_idx" ON "audit_logs"("created_at" DESC);

-- CreateIndex
CREATE INDEX "audit_logs_user_id_created_at_idx" ON "audit_logs"("user_id", "created_at" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "system_settings_key_key" ON "system_settings"("key");

-- AddForeignKey
ALTER TABLE "user_sessions" ADD CONSTRAINT "user_sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_requests" ADD CONSTRAINT "payment_requests_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "payment_requests" ADD CONSTRAINT "payment_requests_reviewed_by_admin_id_fkey" FOREIGN KEY ("reviewed_by_admin_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_file_access_logs" ADD CONSTRAINT "medical_file_access_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medical_file_access_logs" ADD CONSTRAINT "medical_file_access_logs_file_id_fkey" FOREIGN KEY ("file_id") REFERENCES "files"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

