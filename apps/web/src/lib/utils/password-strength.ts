/**
 * Password Strength Calculator
 * Calculates password strength score (0-4) based on various criteria
 */

export interface PasswordStrength {
  score: number; // 0-4
  label: string;
  color: string;
}

const COMMON_PASSWORDS = [
  'password',
  'password123',
  '12345678',
  'qwerty',
  'abc123',
  'letmein',
  'welcome',
  'monkey',
  '1234567890',
  'password1',
];

export function calculatePasswordStrength(password: string): PasswordStrength {
  if (!password) {
    return {
      score: 0,
      label: 'very-weak',
      color: 'bg-red-500',
    };
  }

  let score = 0;

  // Length bonus
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;

  // Character variety
  const hasLower = /[a-z]/.test(password);
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);

  if (hasLower && hasUpper) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;

  // Penalize common patterns
  if (/^[a-z]+$/i.test(password)) score--; // Only letters
  if (/^[0-9]+$/.test(password)) score--; // Only numbers
  if (COMMON_PASSWORDS.includes(password.toLowerCase())) score -= 2;

  // Ensure score is within 0-4 range
  const finalScore = Math.max(0, Math.min(4, score));

  const labels = ['very-weak', 'weak', 'medium', 'strong', 'very-strong'];
  const colors = [
    'bg-red-500',
    'bg-orange-500',
    'bg-yellow-500',
    'bg-cyan-500',
    'bg-green-500',
  ];

  return {
    score: finalScore,
    label: labels[finalScore],
    color: colors[finalScore],
  };
}

export function isCommonPassword(password: string): boolean {
  return COMMON_PASSWORDS.includes(password.toLowerCase());
}

export interface PasswordRequirement {
  id: string;
  test: (password: string) => boolean;
  translationKey: string;
}

export const PASSWORD_REQUIREMENTS: PasswordRequirement[] = [
  {
    id: 'min-length',
    test: (pwd) => pwd.length >= 8,
    translationKey: 'profile.security.requirement.min-length',
  },
  {
    id: 'uppercase',
    test: (pwd) => /[A-Z]/.test(pwd),
    translationKey: 'profile.security.requirement.uppercase',
  },
  {
    id: 'lowercase',
    test: (pwd) => /[a-z]/.test(pwd),
    translationKey: 'profile.security.requirement.lowercase',
  },
  {
    id: 'number',
    test: (pwd) => /[0-9]/.test(pwd),
    translationKey: 'profile.security.requirement.number',
  },
];
