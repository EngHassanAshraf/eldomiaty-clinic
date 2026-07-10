import { NextResponse } from 'next/server';
import {
  getSystemSetting,
  parseMaintenanceMode,
} from '@/lib/settings/system-settings';

export async function GET() {
  const maintenance = parseMaintenanceMode(await getSystemSetting('maintenance_mode'));
  const clinicNameValue = await getSystemSetting('clinic_name');
  const clinicName = typeof clinicNameValue === 'string' && clinicNameValue.trim()
    ? clinicNameValue.trim()
    : 'العيادة';

  return NextResponse.json({
    enabled: maintenance.enabled,
    message: maintenance.message,
    clinicName,
  });
}

