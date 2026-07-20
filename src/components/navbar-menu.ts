import type { User } from '@/lib/api/types';
import { getProfileDisplayName } from '@/lib/user';

export { getProfileDisplayName };

export interface NavbarMenuItem {
    key: string;
    href?: string;
    label: { ar: string; en: string };
    action?: 'logout';
}

export function getAccountMenuItems(role: User['role'], locale: 'ar' | 'en'): NavbarMenuItem[] {
    if (role === 'ADMIN') {
        return [
            { key: 'dashboard', href: '/dashboard', label: { ar: 'لوحة الإدارة',      en: 'Dashboard' } },
            { key: 'settings',  href: '/settings',  label: { ar: 'إعدادات الموقع',    en: 'Settings' } },
            { key: 'logout', action: 'logout',       label: { ar: 'تسجيل الخروج',      en: 'Logout' } },
        ];
    }

    // USER
    return [
        { key: 'profile',       href: '/profile',              label: { ar: 'الملف الشخصي',     en: 'Profile' } },
        { key: 'appointments',  href: '/appointments',         label: { ar: 'المواعيد',          en: 'Appointments' } },
        { key: 'orders',        href: '/payment/my-requests',  label: { ar: 'طلبات الاشتراك',   en: 'Subscription Orders' } },
        { key: 'logout', action: 'logout',                     label: { ar: 'تسجيل الخروج',      en: 'Logout' } },
    ];
}
