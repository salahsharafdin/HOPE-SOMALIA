import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import { countries, countryCodeToFlag, findCountryByName } from '../../data/countries';

export default function CountrySelect({
  value,
  onChange,
  error,
  placeholder = 'Select your country',
  id: idProp,
  name,
  required = true,
}) {
  const autoId = useId();
  const id = idProp || autoId;
  const listboxId = `${id}-listbox`;
  const containerRef = useRef(null);
  const searchRef = useRef(null);

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const selected = findCountryByName(value);

  const filteredCountries = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return countries;
    return countries.filter((c) => c.name.toLowerCase().includes(q));
  }, [query]);

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
        setQuery('');
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setOpen(false);
        setQuery('');
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
  }, [open]);

  const handleSelect = (country) => {
    onChange(country.name);
    setOpen(false);
    setQuery('');
  };

  const triggerClasses = [
    'w-full flex items-center justify-between gap-2 bg-white border rounded-xl px-4 py-2.5 text-xs text-navy-900 text-left transition-colors min-h-[42px]',
    error ? 'border-rose-400 focus:border-rose-500' : 'border-slate-200 hover:border-teal-300',
    open ? 'border-teal-500 ring-2 ring-teal-500/20' : 'focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20',
  ].join(' ');

  return (
    <div ref={containerRef} className="relative">
      {name && (
        <input type="hidden" name={name} value={value || ''} required={required} readOnly />
      )}

      <button
        type="button"
        id={id}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listboxId}
        aria-invalid={error ? 'true' : 'false'}
        className={triggerClasses}
        onClick={() => setOpen((prev) => !prev)}
      >
        <span className="flex items-center gap-2 truncate">
          {selected ? (
            <>
              <span className="text-base leading-none shrink-0" aria-hidden="true">
                {countryCodeToFlag(selected.code)}
              </span>
              <span className="font-medium truncate">{selected.name}</span>
            </>
          ) : (
            <span className="text-slate-500">{placeholder}</span>
          )}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        />
      </button>

      {open && (
        <div
          className="absolute z-50 mt-1.5 w-full bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden"
          role="presentation"
        >
          <div className="p-2 border-b border-slate-100 bg-slate-50">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchRef}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search countries..."
                autoComplete="off"
                className="w-full bg-white border border-slate-200 rounded-lg pl-9 pr-3 py-2.5 text-xs text-navy-900 placeholder:text-slate-400 focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20"
              />
            </div>
          </div>

          <ul
            id={listboxId}
            role="listbox"
            aria-labelledby={id}
            className="max-h-56 sm:max-h-64 overflow-y-auto overscroll-contain py-1"
          >
            {filteredCountries.length === 0 ? (
              <li className="px-4 py-3 text-xs text-slate-500 text-center">No countries found</li>
            ) : (
              filteredCountries.map((country) => {
                const isSelected = country.name === value;
                return (
                  <li key={country.code} role="option" aria-selected={isSelected}>
                    <button
                      type="button"
                      onClick={() => handleSelect(country)}
                      className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-xs transition-colors min-h-[44px] sm:min-h-0 ${
                        isSelected
                          ? 'bg-teal-50 text-teal-900 font-semibold'
                          : 'text-navy-900 hover:bg-slate-50 active:bg-slate-100'
                      }`}
                    >
                      <span className="text-base leading-none shrink-0" aria-hidden="true">
                        {countryCodeToFlag(country.code)}
                      </span>
                      <span className="truncate">{country.name}</span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}

      {error && <p className="text-[11px] text-rose-600 font-medium mt-1">{error}</p>}
    </div>
  );
}
