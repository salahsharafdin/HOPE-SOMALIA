import {
  AsYouType,
  getCountryCallingCode,
  isValidPhoneNumber,
  parsePhoneNumberFromString,
} from 'libphonenumber-js';
import { countries, findCountryByName } from '../data/countries';

export const phoneCountries = countries
  .map((country) => {
    try {
      const callingCode = getCountryCallingCode(country.code);
      return {
        ...country,
        dialCode: `+${callingCode}`,
        dialDigits: callingCode,
      };
    } catch {
      return null;
    }
  })
  .filter(Boolean)
  .sort((a, b) => a.name.localeCompare(b.name));

export function findPhoneCountryByIso(iso) {
  return phoneCountries.find((c) => c.code === iso) || null;
}

export function isoFromCountryName(countryName) {
  return findCountryByName(countryName)?.code || null;
}

/**
 * When the user types an international number (e.g. +252…), detect the country
 * and return national digits for display in the local number field.
 */
export function detectInternationalPrefix(input) {
  const trimmed = (input || '').trim();
  if (!trimmed.startsWith('+')) return null;

  const parsed = parsePhoneNumberFromString(trimmed);
  if (parsed?.country) {
    const nationalDigits = parsed.nationalNumber ? String(parsed.nationalNumber) : '';
    return {
      iso: parsed.country,
      nationalDigits,
      nationalFormatted: nationalDigits ? parsed.formatNational() : '',
    };
  }

  const formatter = new AsYouType();
  formatter.input(trimmed);
  const fromFormatter = formatter.getNumber();
  if (fromFormatter?.country) {
    const nationalDigits = fromFormatter.nationalNumber ? String(fromFormatter.nationalNumber) : '';
    return {
      iso: fromFormatter.country,
      nationalDigits,
      nationalFormatted: nationalDigits ? fromFormatter.formatNational() : '',
    };
  }

  const digits = trimmed.slice(1).replace(/\D/g, '');
  if (!digits) return null;

  const byLength = [...phoneCountries].sort((a, b) => b.dialDigits.length - a.dialDigits.length);
  for (const country of byLength) {
    if (digits === country.dialDigits || digits.startsWith(country.dialDigits)) {
      const nationalDigits = digits.slice(country.dialDigits.length);
      return {
        iso: country.code,
        nationalDigits,
        nationalFormatted: nationalDigits ? formatNationalInput(nationalDigits, country.code) : '',
      };
    }
  }

  return null;
}

export function stripDuplicateCallingCode(input, iso) {
  if (!iso || !input) return '';

  const trimmed = input.trim();
  const parsed = parsePhoneNumberFromString(trimmed);
  if (parsed?.nationalNumber) {
    if (!parsed.country || parsed.country === iso) {
      return String(parsed.nationalNumber);
    }
  }

  let digits = trimmed.replace(/\D/g, '');
  if (!digits) return '';

  try {
    const callingCode = getCountryCallingCode(iso);
    if (digits.startsWith(callingCode)) {
      digits = digits.slice(callingCode.length);
    }
  } catch {
    // keep digits as-is
  }

  return digits;
}

export function formatNationalInput(nationalDigits, iso) {
  if (!iso || !nationalDigits) return '';
  const formatter = new AsYouType(iso);
  return formatter.input(nationalDigits);
}

export function buildE164FromNational(nationalDigits, iso) {
  if (!iso || !nationalDigits) return '';
  const parsed = parsePhoneNumberFromString(nationalDigits, iso);
  if (parsed?.isValid()) {
    return parsed.format('E.164');
  }
  try {
    const callingCode = getCountryCallingCode(iso);
    const candidate = `+${callingCode}${nationalDigits}`;
    const fallback = parsePhoneNumberFromString(candidate);
    if (fallback) {
      return fallback.format('E.164');
    }
    return candidate;
  } catch {
    return '';
  }
}

export function validatePhoneForCountry(phone, countryName, { required = false } = {}) {
  const trimmed = (phone || '').trim();

  if (!trimmed) {
    if (required) {
      return { ok: false, message: 'Phone number is required' };
    }
    return { ok: true, e164: '' };
  }

  const iso = isoFromCountryName(countryName);
  if (!iso) {
    return { ok: false, message: 'Please select a country before entering a phone number' };
  }

  if (!isValidPhoneNumber(trimmed, iso)) {
    return {
      ok: false,
      message: 'Enter a valid phone number for the selected country',
    };
  }

  const parsed = parsePhoneNumberFromString(trimmed, iso) || parsePhoneNumberFromString(trimmed);
  return { ok: true, e164: parsed ? parsed.format('E.164') : trimmed };
}
