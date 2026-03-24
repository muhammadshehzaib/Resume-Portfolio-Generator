'use client';

import { useState, useEffect } from 'react';
import { CustomColors, PortfolioSettings } from '@/lib/types';
import { updateSettings, checkSlugAvailability } from '@/lib/api';

interface SettingsPanelProps {
  portfolioId: string;
  customColors?: CustomColors;
  slug?: string;
  onClose: () => void;
  onUpdate: (settings: PortfolioSettings) => void;
}

export default function SettingsPanel({ portfolioId, customColors, slug, onClose, onUpdate }: SettingsPanelProps) {
  const [primaryColor, setPrimaryColor] = useState(customColors?.primaryColor || '#3b82f6');
  const [bgColor, setBgColor] = useState(customColors?.bgColor || '#ffffff');
  const [slugValue, setSlugValue] = useState(slug || '');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string>();
  const [slugError, setSlugError] = useState<string>();
  const [success, setSuccess] = useState(false);
  const [slugChecking, setSlugChecking] = useState(false);
  const [slugAvailable, setSlugAvailable] = useState<boolean | null>(null);

  // Slug validation regex
  const slugRegex = /^[a-z0-9][a-z0-9-]{1,48}[a-z0-9]$/;

  const validateSlug = (value: string) => {
    if (!value) {
      setSlugError(undefined);
      return true;
    }
    if (!slugRegex.test(value)) {
      setSlugError('3-50 chars, lowercase alphanumeric and hyphens only');
      return false;
    }
    setSlugError(undefined);
    return true;
  };

  const handleSlugChange = (value: string) => {
    const lowerValue = value.toLowerCase();
    setSlugValue(lowerValue);
    setSlugAvailable(null);
    validateSlug(lowerValue);
  };

  const handleSave = async () => {
    if (slugValue && !validateSlug(slugValue)) {
      return;
    }

    setSaving(true);
    setError(undefined);
    try {
      const settings: PortfolioSettings = {
        custom_colors: {
          primaryColor,
          bgColor,
        },
        ...(slugValue && { slug: slugValue }),
      };
      await updateSettings(portfolioId, settings);
      onUpdate(settings);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!slugValue || slugError) {
      setSlugAvailable(null);
      return;
    }

    let isMounted = true;

    const timer = setTimeout(async () => {
      setSlugChecking(true);
      try {
        const result = await checkSlugAvailability(slugValue, portfolioId);
        // Only update state if this request is still relevant (component hasn't unmounted, request wasn't cancelled)
        if (isMounted) {
          setSlugAvailable(result.available);
        }
      } catch (err) {
        // Ignore errors from cancelled requests
        if (isMounted) {
          setSlugAvailable(null);
        }
      } finally {
        if (isMounted) {
          setSlugChecking(false);
        }
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [slugValue, slugError, portfolioId]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="border-b border-gray-200 p-6 flex justify-between items-center">
          <h2 className="text-xl font-bold text-gray-900">Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
          >
            ✕
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-96 overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-700 text-sm">Settings saved ✓</p>
            </div>
          )}

          {/* Primary Color */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Primary Accent Color</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-16 h-10 rounded-lg cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
              />
            </div>
          </div>

          {/* Background Color */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Background Color</label>
            <div className="flex gap-3 items-center">
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="w-16 h-10 rounded-lg cursor-pointer border border-gray-300"
              />
              <input
                type="text"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm font-mono"
              />
            </div>
          </div>

          {/* Custom Slug */}
          <div>
            <label className="block text-sm font-semibold text-gray-900 mb-2">Custom URL Slug</label>
            <div className="flex items-center bg-gray-50 border border-gray-300 rounded-lg overflow-hidden">
              <span className="px-3 py-2 text-gray-600 text-sm bg-gray-100">/p/</span>
              <input
                type="text"
                placeholder="johndoe"
                value={slugValue}
                onChange={(e) => handleSlugChange(e.target.value)}
                className="flex-1 px-3 py-2 bg-transparent border-none focus:outline-none text-sm"
              />
              {(slugError || slugAvailable === false) && (
                <span className="px-3 py-2 text-red-600 text-lg">✗</span>
              )}
              {slugAvailable === true && !slugError && (
                <span className="px-3 py-2 text-green-600 text-lg">✓</span>
              )}
            </div>
            {slugError ? (
              <p className="text-red-600 text-xs mt-1">{slugError}</p>
            ) : slugChecking ? (
              <p className="text-gray-400 text-xs mt-1">Checking...</p>
            ) : slugAvailable === true ? (
              <p className="text-green-600 text-xs mt-1">Available!</p>
            ) : slugAvailable === false ? (
              <p className="text-red-600 text-xs mt-1">Already taken</p>
            ) : slugValue ? (
              <p className="text-gray-400 text-xs mt-1">Checking...</p>
            ) : (
              <p className="text-gray-500 text-xs mt-1">Leave blank to use portfolio ID</p>
            )}
          </div>

          {/* Color Preview */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-xs font-semibold text-gray-600 mb-3 uppercase">Preview</p>
            <div
              style={{ backgroundColor: bgColor }}
              className="p-4 rounded-lg"
            >
              <h3
                style={{ color: primaryColor }}
                className="font-bold text-lg"
              >
                Sample Heading
              </h3>
              <p className="text-gray-700 text-sm mt-2">Your colors will appear in portfolio headers and accents</p>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-200 p-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={saving || !!slugError || slugAvailable === false}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-medium"
          >
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </div>
    </div>
  );
}
