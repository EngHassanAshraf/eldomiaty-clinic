import type { Locale } from '@/lib/i18n';
import { UI } from '@/lib/i18n';

const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%&_]).{8,}$/;

// ── Per-rule requirement shape ───────────────────────────────────────────

export interface PasswordRequirement {
  /** Localised label shown in the checklist. */
  label: string;
  /** Whether this specific rule is currently satisfied. */
  met: boolean;
}

/**
 * Returns the status of each individual password requirement.
 * Used to render the real-time checklist below the Password field.
 */
export function getPasswordRequirements(
  password: string,
  locale: Locale
): PasswordRequirement[] {
  const ar = locale === 'ar';
  return [
    {
      label: ar ? '8 أحرف على الأقل'            : 'At least 8 characters',
      met:   password.length >= 8,
    },
    {
      label: ar ? 'حرف كبير واحد (A-Z)'          : 'One uppercase letter (A-Z)',
      met:   /[A-Z]/.test(password),
    },
    {
      label: ar ? 'حرف صغير واحد (a-z)'          : 'One lowercase letter (a-z)',
      met:   /[a-z]/.test(password),
    },
    {
      label: ar ? 'رقم واحد (0-9)'               : 'One number (0-9)',
      met:   /\d/.test(password),
    },
    {
      label: ar ? 'رمز خاص واحد (!@#$%&_)'       : 'One special character (!@#$%&_)',
      met:   /[!@#$%&_]/.test(password),
    },
  ];
}

// ── Whole-password validators ────────────────────────────────────────────

/**
 * Returns null when ALL requirements are met, or a localized error string.
 * Delegates to PASSWORD_REGEX so the rule set is defined exactly once.
 */
export function validatePassword(password: string, locale: Locale): string | null {
  if (!PASSWORD_REGEX.test(password)) {
    return UI[locale].passwordInvalid;
  }
  return null;
}

/**
 * Returns a localized error message when confirmPassword does not match password.
 * Returns null when they match.
 */
export function validatePasswordMatch(
  password: string,
  confirmPassword: string,
  locale: Locale
): string | null {
  if (password !== confirmPassword) {
    return UI[locale].passwordMismatch;
  }
  return null;
}
