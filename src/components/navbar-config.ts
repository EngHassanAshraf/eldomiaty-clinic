import type { User } from '@/lib/api/types';

export type NavbarVariant = 'landing' | 'user' | 'admin';

export interface NavbarLink {
    href: string;
    label: { ar: string; en: string };
}

const landingLinks: NavbarLink[] = [
    { href: '/#home', label: { ar: 'الرئيسية', en: 'Home' } },
    { href: '/#about', label: { ar: 'عن الدكتور', en: 'About Doctor' } },
    { href: '/#services', label: { ar: 'الخدمات', en: 'Services' } },
    { href: '/#branches', label: { ar: 'الفروع', en: 'Branches' } },
    { href: '/#contact', label: { ar: 'اتصل بنا', en: 'Contact' } },
    { href: '/articles', label: { ar: 'الروشتة', en: 'Medical Articles' } },
];

const userLinks: NavbarLink[] = [
    { href: '/', label: { ar: 'الرئيسية', en: 'Home' } },
    { href: '/files', label: { ar: 'الملفات', en: 'Files' } },
    { href: '/articles', label: { ar: 'الروشتة', en: 'Medical Articles' } },
];

const adminLinks: NavbarLink[] = [
    { href: '/', label: { ar: 'الرئيسية', en: 'Site Home' } },
    { href: '/dashboard', label: { ar: 'لوحة التحكم', en: 'Dashboard' } },
    { href: '/appointments', label: { ar: 'المواعيد', en: 'Appointments' } },
    { href: '/articles', label: { ar: 'الروشتة', en: 'Medical Articles' } },
    { href: '/settings', label: { ar: 'إعدادات الموقع', en: 'Site Settings' } },
];

export function getNavbarVariant(pathname: string, userRole?: User['role']): NavbarVariant {
    if (userRole === 'ADMIN') return 'admin';
    if (pathname === '/' || pathname.startsWith('/#') || pathname === '') return 'landing';
    return 'user';
}

export function getNavbarLinks(variant: NavbarVariant): NavbarLink[] {
    switch (variant) {
        case 'admin':
            return adminLinks;
        case 'user':
            return userLinks;
        case 'landing':
        default:
            return landingLinks;
    }
}
