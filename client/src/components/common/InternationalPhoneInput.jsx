import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { countryCodeToFlag } from '../../data/countries';
import {
  buildE164FromNational,
  detectInternationalPrefix,
  findPhoneCountryByIso,
  formatNationalInput,
  isoFromCountryName,
  phoneCountries,
  stripDuplicateCallingCode,
} from '../../utils/phone';
import { parsePhoneNumberFromString } from 'libphonenumber-js';

export default function InternationalPhoneInput({
  value = '',
  onChange,
  linkedCountryName,
  error,
  id: idProp,
  placeholder = '',
  required = false,
}) {
  const autoId = useId();
  const id = idProp || autoId;
  const listboxId = `${id}-dial-listbox`;
  const containerRef = useRef(null);
  const dialContainerRef = useRef(null);
  const searchRef = useRef(null);
  const nationalInputRef = useRef(null);

  const defaultIso = isoFromCountryName(linkedCountryName) || 'SO';

  const [isoCountry, setIsoCountry] = useState(defaultIso);
  const [nationalDisplay, setNationalDisplay] = useState('');
  const nationalDisplayRef = useRef('');
  const lastEmittedE164Ref = useRef(value || '');
  const [dialOpen, setDialOpen] = useState(false);
  const [dialQuery, setDialQuery] = useState('');

  nationalDisplayRef.current = nationalDisplay;

  const pushE164 = (e164) => {
    const normalized = e164 || '';
    lastEmittedE164Ref.current = normalized;
    onChange(normalized);
  };

  const applyExternalValue = (e164) => {
    if (!e164) {
      setNationalDisplay('');
      return;
    }

    const parsed = parsePhoneNumberFromString(e164);
    const iso = parsed?.country || isoCountry;

    if (parsed?.country) {
      setIsoCountry(parsed.country);
    }

    const nationalDigits = parsed?.nationalNumber
      ? String(parsed.nationalNumber)
      : stripDuplicateCallingCode(e164, iso);

    setNationalDisplay(nationalDigits ? formatNationalInput(nationalDigits, iso) : '');
  };

  const selectedDial = findPhoneCountryByIso(isoCountry);

  const filteredDialCountries = useMemo(() => {
    const q = dialQuery.trim().toLowerCase();
    if (!q) return phoneCountries;
    return phoneCountries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dialCode.includes(q.replace(/\s/g, '')) ||
        c.code.toLowerCase().includes(q)
    );
  }, [dialQuery]);

  useEffect(() => {
    const external = value || '';
    if (external === lastEmittedE164Ref.current) return;
    lastEmittedE164Ref.current = external;
    applyExternalValue(external);
  }, [value]);

  useEffect(() => {
    const linkedIso = isoFromCountryName(linkedCountryName);
    if (!linkedIso) return;

    setIsoCountry(linkedIso);

    const nationalDigits = stripDuplicateCallingCode(nationalDisplayRef.current, linkedIso);
    if (!nationalDigits) return;

    const display = formatNationalInput(nationalDigits, linkedIso);
    setNationalDisplay(display);
    pushE164(buildE164FromNational(nationalDigits, linkedIso));
  }, [linkedCountryName]);

  useEffect(() => {
    if (!dialOpen) return undefined;

    const handlePointerDown = (event) => {
      if (dialContainerRef.current && !dialContainerRef.current.contains(event.target)) {
        setDialOpen(false);
        setDialQuery('');
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setDialOpen(false);
        setDialQuery('');
      }
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);
    document.addEventListener('keydown', handleEscape);
    const timer = setTimeout(() => searchRef.current?.focus(), 0);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [dialOpen]);

  const emitNationalChange = (rawInput, iso) => {
    const trimmed = rawInput.trim();

    if (trimmed.startsWith('+')) {
      const international = detectInternationalPrefix(trimmed);
      if (international) {
        setIsoCountry(international.iso);
        setNationalDisplay(international.nationalFormatted);
        if (international.nationalDigits) {
          pushE164(buildE164FromNational(international.nationalDigits, international.iso));
        } else {
          pushE164('');
        }
        return;
      }
    }

    const nationalDigits = stripDuplicateCallingCode(rawInput, iso);
    const display = formatNationalInput(nationalDigits, iso);
    setNationalDisplay(display);
    pushE164(nationalDigits ? buildE164FromNational(nationalDigits, iso) : '');
  };

  const handleNationalChange = (event) => {
    emitNationalChange(event.target.value, isoCountry);
  };

  const handleDialSelect = (country) => {
    setIsoCountry(country.code);
    setDialOpen(false);
    setDialQuery('');

    const nationalDigits = stripDuplicateCallingCode(nationalDisplay, country.code);
    const display = formatNationalInput(nationalDigits, country.code);
    setNationalDisplay(display);
    pushE164(buildE164FromNational(nationalDigits, country.code));
    nationalInputRef.current?.focus();
  };

  const borderClass = error
    ? 'border-rose-400 focus-within:border-rose-500 focus-within:ring-rose-500/15'
    : 'border-slate-200 focus-within:border-brand-500 focus-within:ring-brand-500/15';

  return (
    <div ref={containerRef} className="space-y-1.5">
      <div
        className={`flex items-stretch min-h-[46px] sm:min-h-[48px] rounded-xl border bg-slate-50 shadow-sm shadow-slate-900/5 transition-[border-color,box-shadow] focus-within:ring-2 ${borderClass}`}
      >
        <div ref={dialContainerRef} className="relative flex shrink-0">
          <button
            type="button"
            aria-haspopup="listbox"
            aria-expanded={dialOpen}
            aria-controls={listboxId}
            className="flex h-full items-center justify-center gap-2 px-3 sm:px-3.5 min-w-[6.75rem] sm:min-w-[7.25rem] border-r border-slate-200/90 bg-white/60 hover:bg-white transition-colors rounded-l-xl"
            onClick={() => setDialOpen((prev) => !prev)}
          >
            <span className="text-lg leading-none shrink-0" aria-hidden="true">
              {selectedDial ? countryCodeToFlag(selectedDial.code) : '🌐'}
            </span>
            <span className="text-sm font-semibold text-navy-900 tabular-nums tracking-wide">
              {selectedDial?.dialCode || '+—'}
            </span>
            <ChevronDown
              className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${dialOpen ? 'rotate-180' : ''}`}
              aria-hidden="true"
            />
          </button>

          {dialOpen && (
            <div
              className="absolute left-0 z-50 mt-1.5 w-[min(100vw-2rem,20rem)] sm:w-72 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
              role="presentation"
            >
              <div className="p-2 border-b border-slate-100 bg-slate-50">
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    ref={searchRef}
                    type="search"
                    value={dialQuery}
                    onChange={(e) => setDialQuery(e.target.value)}
                    placeholder="Search country or code..."
                    autoComplete="off"
                    className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-xs text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
                  />
                </div>
              </div>
              <ul
                id={listboxId}
                role="listbox"
                className="max-h-56 sm:max-h-64 overflow-y-auto overscroll-contain py-1"
              >
                {filteredDialCountries.length === 0 ? (
                  <li className="px-4 py-3 text-xs text-slate-500 text-center">No matches</li>
                ) : (
                  filteredDialCountries.map((country) => {
                    const isSelected = country.code === isoCountry;
                    return (
                      <li key={country.code} role="option" aria-selected={isSelected}>
                        <button
                          type="button"
                          onClick={() => handleDialSelect(country)}
                          className={`w-full flex items-center gap-2 px-3 py-2.5 text-left text-xs min-h-[44px] sm:min-h-0 transition-colors ${
                            isSelected
                              ? 'bg-teal-50 text-teal-900 font-semibold'
                              : 'text-navy-900 hover:bg-slate-50 active:bg-slate-100'
                          }`}
                        >
                          <span className="text-base leading-none shrink-0" aria-hidden="true">
                            {countryCodeToFlag(country.code)}
                          </span>
                          <span className="flex-1 truncate">{country.name}</span>
                          <span className="text-teal-700 font-semibold tabular-nums shrink-0">
                            {country.dialCode}
                          </span>
                        </button>
                      </li>
                    );
                  })
                )}
              </ul>
            </div>
          )}
        </div>

        <input
          ref={nationalInputRef}
          id={id}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          required={required}
          value={nationalDisplay}
          onChange={handleNationalChange}
          placeholder={placeholder}
          className="flex-1 min-w-0 w-full bg-transparent px-4 sm:px-5 py-3 text-sm font-medium leading-6 text-navy-900 placeholder:text-slate-400 tabular-nums tracking-wide antialiased focus:outline-none rounded-r-xl"
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? `${id}-error` : undefined}
        />
      </div>

      {error && (
        <p id={`${id}-error`} className="text-[11px] text-rose-600 font-medium">
          {error}
        </p>
      )}
    </div>
  );
}
