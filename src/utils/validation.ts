/**
 * SkillBridge Validation Utilities
 * Strict validation helpers for email, domains, phone numbers, and credentials.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  normalizedValue?: string;
}

const COMMON_TYPO_TLDS = new Set([
  'con', 'cmo', 'cpm', 'comm', 'coom', 'cm', 'vcom', 'om', 'xom', 'vom',
  'gmai', 'gmaill', 'outloo', 'hotm', 'col', 'kom', 'cnm', 'cpm'
]);

const COMMON_DOMAIN_TYPOS: Record<string, string> = {
  'gmail.con': 'gmail.com',
  'gmail.cmo': 'gmail.com',
  'gmail.cm': 'gmail.com',
  'gmail.comm': 'gmail.com',
  'gmail.coom': 'gmail.com',
  'gmail.vom': 'gmail.com',
  'gmail.om': 'gmail.com',
  'yahoo.con': 'yahoo.com',
  'yahoo.cmo': 'yahoo.com',
  'yahoo.cm': 'yahoo.com',
  'yahoo.comm': 'yahoo.com',
  'hotmail.con': 'hotmail.com',
  'hotmail.cmo': 'hotmail.com',
  'hotmail.cm': 'hotmail.com',
  'outlook.con': 'outlook.com',
  'outlook.cmo': 'outlook.com',
  'outlook.cm': 'outlook.com',
  'icloud.con': 'icloud.com',
  'icloud.cmo': 'icloud.com'
};

/**
 * Validates an email address strictly.
 * Disallows invalid formats and common typos like .con instead of .com.
 */
export function validateEmail(rawEmail: string): ValidationResult {
  const email = (rawEmail || '').trim().toLowerCase();

  if (!email) {
    return { isValid: false, error: 'Email address cannot be empty.' };
  }

  // Must have exactly one @
  const atParts = email.split('@');
  if (atParts.length !== 2) {
    return { isValid: false, error: 'Please enter a valid email address containing a single "@" symbol.' };
  }

  const [localPart, domainPart] = atParts;

  // Local part must not be empty or have invalid characters
  if (!localPart || localPart.length > 64) {
    return { isValid: false, error: 'The email username part before "@" is invalid.' };
  }

  // Domain part must have at least one dot
  if (!domainPart || !domainPart.includes('.')) {
    return { isValid: false, error: 'The email domain must include a top-level domain (e.g., @gmail.com or @college.edu.in).' };
  }

  // Standard email format check
  const standardEmailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  if (!standardEmailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email format (e.g., name@example.com).' };
  }

  // Check domain segments
  const domainSegments = domainPart.split('.');
  const tld = domainSegments[domainSegments.length - 1];

  if (tld.length < 2) {
    return { isValid: false, error: `Invalid email domain extension ".${tld}". Top-level domains must be at least 2 characters.` };
  }

  // Check known typo TLDs
  if (COMMON_TYPO_TLDS.has(tld)) {
    const suggestion = tld.startsWith('co') || tld === 'con' || tld === 'cmo' || tld === 'comm' ? '.com' : '.com or .in';
    return {
      isValid: false,
      error: `Invalid email domain ending ".${tld}". Did you mean "${suggestion}"?`
    };
  }

  // Check specific domain typos
  if (COMMON_DOMAIN_TYPOS[domainPart]) {
    return {
      isValid: false,
      error: `Typo detected in email domain "${domainPart}". Did you mean "${COMMON_DOMAIN_TYPOS[domainPart]}"?`
    };
  }

  return { isValid: true, normalizedValue: email };
}
