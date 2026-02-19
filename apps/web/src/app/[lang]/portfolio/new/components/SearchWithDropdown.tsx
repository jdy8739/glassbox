'use client';

import { useTranslation } from 'react-i18next';
import { MapPin } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

interface SearchResult {
  symbol: string;
  name: string;
  exchange: string;
}

interface SearchWithDropdownProps {
  searchInput: string;
  setSearchInput: (value: string) => void;
  searchResults: SearchResult[];
  isSearching: boolean;
  showDropdown: boolean;
  setShowDropdown: (show: boolean) => void;
  onAddItem: (result: SearchResult) => void;
}

/**
 * Search input with dropdown results
 * Manages its own positioning, keyboard navigation, and click-outside logic
 */
export function SearchWithDropdown({
  searchInput,
  setSearchInput,
  searchResults,
  isSearching,
  showDropdown,
  setShowDropdown,
  onAddItem,
}: SearchWithDropdownProps) {
  const { t } = useTranslation();

  // Internal state for dropdown positioning and keyboard nav
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // Button state
  const isAddButtonEnabled = searchInput.trim().length > 0 && searchResults.length > 0 && !isSearching;

  // Get tooltip message for button state
  const getButtonTooltip = (): string => {
    if (searchInput.trim().length === 0) return t('portfolio.builder.search.enter-ticker');
    if (isSearching) return t('portfolio.builder.search.searching');
    if (searchResults.length === 0) return t('portfolio.builder.search.no-results-add');
  };

  // Refs for DOM elements
  const searchRef = useRef<HTMLDivElement>(null);
  const inputWrapperRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const resultRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Reset selected index when results change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [searchResults]);

  // Auto-show dropdown when results arrive
  useEffect(() => {
    setShowDropdown(searchResults.length > 0 && searchInput.length > 0);
  }, [searchResults, searchInput, setShowDropdown]);

  // Update dropdown position
  useEffect(() => {
    const updatePosition = () => {
      if (inputWrapperRef.current) {
        const rect = inputWrapperRef.current.getBoundingClientRect();
        setDropdownPosition({
          top: rect.bottom + window.scrollY + 8,
          left: rect.left + window.scrollX,
          width: rect.width,
        });
      }
    };

    if (!showDropdown) return;

    updatePosition();
    window.addEventListener('resize', updatePosition);
    window.addEventListener('scroll', updatePosition);
    return () => {
      window.removeEventListener('resize', updatePosition);
      window.removeEventListener('scroll', updatePosition);
    };
  }, [showDropdown]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [setShowDropdown]);

  // Keyboard navigation handler
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown || searchResults.length === 0) {
      if (e.key === 'Enter' && searchInput.trim().length > 0 && searchResults.length > 0) {
        e.preventDefault();
        onAddItem(searchResults[0]);
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = prev + 1;
          if (next >= searchResults.length) return 0;
          resultRefs.current[next]?.scrollIntoView({ block: 'nearest' });
          return next;
        });
        break;

      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex((prev) => {
          const next = prev - 1;
          if (next < 0) return searchResults.length - 1;
          resultRefs.current[next]?.scrollIntoView({ block: 'nearest' });
          return next;
        });
        break;

      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && selectedIndex < searchResults.length) {
          onAddItem(searchResults[selectedIndex]);
        } else if (searchResults.length > 0) {
          onAddItem(searchResults[0]);
        }
        break;

      case 'Escape':
        setShowDropdown(false);
        break;
    }
  };

  return (
    <>
      {/* Search Input */}
      <div className="glass-card-gradient cyan-blue overflow-visible relative z-30">
        <div className="space-y-4 overflow-visible">
          <label className="flex items-center gap-2 text-sm font-semibold text-black dark:text-white">
            <MapPin className="w-4 h-4" />
            {t('portfolio.builder.search.label')}
          </label>

          <div className="relative overflow-visible" ref={searchRef}>
            <div className="flex gap-3" ref={inputWrapperRef}>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onFocus={() => {
                    if (searchResults.length > 0) setShowDropdown(true);
                  }}
                  onKeyDown={handleKeyDown}
                  placeholder={t('portfolio.builder.search.placeholder')}
                  className="glass-input w-full text-lg pr-10"
                />

                {isSearching && (
                  <div className="absolute right-3 top-1/2 -translate-y-1/2">
                    <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
              </div>

              <button
                onClick={() => {
                  if (searchResults.length > 0) {
                    onAddItem(searchResults[0]);
                  }
                }}
                disabled={!isAddButtonEnabled}
                className={`glass-button whitespace-nowrap transition-all duration-200 ${
                  isAddButtonEnabled
                    ? 'opacity-100 cursor-pointer hover:scale-105 active:scale-95'
                    : 'opacity-50 cursor-not-allowed'
                }`}
                title={getButtonTooltip()}
              >
                {t('portfolio.builder.search.add')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Dropdown Portal */}
      {typeof window !== 'undefined' &&
        showDropdown &&
        createPortal(
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              width: `${dropdownPosition.width}px`,
              zIndex: 9999,
            }}
          >
            {searchResults.length > 0 ? (
              <div className="max-h-80 overflow-y-auto rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl">
                <div className="p-2 space-y-1">
                  {searchResults.map((result, index) => (
                    <button
                      key={result.symbol}
                      ref={(el) => {
                        resultRefs.current[index] = el;
                      }}
                      onClick={() => onAddItem(result)}
                      className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center justify-between group ${
                        index === selectedIndex
                          ? 'bg-slate-100 dark:bg-slate-800'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <span className="font-bold text-slate-900 dark:text-white text-lg">
                            {result.symbol}
                          </span>
                          <span className="text-xs px-2 py-1 rounded bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-300 border border-cyan-200 dark:border-cyan-800 font-semibold">
                            {result.exchange}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-medium">
                          {result.name}
                        </p>
                      </div>
                      <span className="text-slate-400 dark:text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                        →
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : !isSearching && searchInput.length > 0 ? (
              <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 text-center">
                <p className="text-slate-900 dark:text-white font-medium">
                  {t('portfolio.builder.search.no-results', { query: searchInput })}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
                  {t('portfolio.builder.search.try-different')}
                </p>
              </div>
            ) : null}
          </div>,
          document.body
        )}
    </>
  );
}
