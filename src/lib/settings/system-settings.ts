import { prisma } from '@/lib/prisma/client';

export async function getSystemSetting(key: string): Promise<unknown | null> {
  const row = await prisma.systemSetting.findUnique({
    where: { key },
    select: { value: true },
  });
  return row?.value ?? null;
}

export function parseAllowRegistrations(value: unknown): boolean {
  return value === null ? true : Boolean(value);
}

export function parseMaintenanceMode(value: unknown): { enabled: boolean; message?: string } {
  // Backward compatible: legacy boolean stored in DB
  if (typeof value === 'boolean') {
    return { enabled: value };
  }

  if (value && typeof value === 'object') {
    const v = value as Record<string, unknown>;
    if (typeof v.enabled === 'boolean') {
      const msg = typeof v.message === 'string' && v.message.trim() ? v.message.trim() : undefined;
      return { enabled: v.enabled, message: msg };
    }
  }

  return { enabled: false };
}

