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
            { key: 'dashboard', href: '/dashboard', label: { ar: 'لوحة الإدارة', en: 'Admin Dashboard' } },
            { key: 'settings', href: '/maintenance', label: { ar: 'الإعدادات', en: 'Settings' } },
        ];
    }

    return [
        { key: 'profile', href: '/profile', label: { ar: 'الملف الشخصي', en: 'Profile' } },
        { key: 'orders', href: '/payment/my-requests', label: { ar: 'طلبات الاشتراك', en: 'Subscription Orders' } },
        { key: 'files', href: '/files', label: { ar: 'ملفات MROCG', en: 'MROCG Files' } },
        { key: 'logout', action: 'logout', label: { ar: 'تسجيل الخروج', en: 'Logout' } },
    ];
}

