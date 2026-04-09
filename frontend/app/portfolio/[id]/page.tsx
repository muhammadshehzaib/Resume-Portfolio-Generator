'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import TemplateSwitcher from '@/components/portfolio/TemplateSwitcher';
import ShareButton from '@/components/portfolio/ShareButton';
import AtsScoreCard from '@/components/portfolio/AtsScoreCard';
import EditMode from '@/components/portfolio/EditMode';
import MinimalTemplate from '@/components/portfolio/templates/MinimalTemplate';
import ModernTemplate from '@/components/portfolio/templates/ModernTemplate';
import CreativeTemplate from '@/components/portfolio/templates/CreativeTemplate';
import QRCodeModal from '@/components/portfolio/QRCodeModal';
import JobCustomizationModal from '@/components/portfolio/JobCustomizationModal';
import SuggestionsModal from '@/components/portfolio/SuggestionsModal';
import { getPortfolio, updatePortfolio, updateSettings } from '@/lib/api';
import { PortfolioResponse, ParsedResume, PortfolioSettings } from '@/lib/types';
import SettingsPanel from '@/components/portfolio/SettingsPanel';

export default function PortfolioPage() {
  const params = useParams();
  const id = params.id as string;
  const [portfolio, setPortfolio] = useState<PortfolioResponse | null>(null);
  const [template, setTemplate] = useState('minimal');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>();
  const [isEditing, setIsEditing] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [availableForHire, setAvailableForHire] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showQRCode, setShowQRCode] = useState(false);
  const [showJobCustomization, setShowJobCustomization] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const actionBtn = 'inline-flex h-11 items-center gap-2 rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 shadow-sm transition-colors hover:bg-slate-100';
  const actionBtnPrimary = 'inline-flex h-11 items-center gap-2 rounded-xl bg-slate-800 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-slate-700';
  const actionBtnAccent = 'inline-flex h-11 items-center gap-2 rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-sky-700';

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        const data = await getPortfolio(id);
        setPortfolio(data);
        setTemplate(data.template);
        setAvailableForHire(data.available_for_hire || false);
        setDarkMode(data.dark_mode || false);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load portfolio');
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolio();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-blue-500 border-opacity-30 border-t-blue-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  if (error || !portfolio) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600 font-semibold mb-4">{error || 'Portfolio not found'}</p>
          <a href="/" className="text-blue-600 hover:text-blue-700 underline">← Back to upload</a>
        </div>
      </div>
    );
  }

  const handleSaveEdit = async (data: ParsedResume) => {
    try {
      setError(undefined);
      const updated = await updatePortfolio(portfolio!.id, data);
      setPortfolio(updated);
      setIsEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save changes';
      setError(errorMessage);
      console.error('Save error:', err);
    }
  };

  const handleToggleAvailableForHire = async () => {
    try {
      const newValue = !availableForHire;
      const updated = await updateSettings(portfolio!.id, { available_for_hire: newValue });
      setAvailableForHire(newValue);
      setPortfolio(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update available for hire:', err);
    }
  };

  const handleToggleDarkMode = async () => {
    try {
      const newValue = !darkMode;
      const updated = await updateSettings(portfolio!.id, { dark_mode: newValue });
      setDarkMode(newValue);
      setPortfolio(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to update dark mode:', err);
    }
  };

  const handleSettingsUpdate = (settings: PortfolioSettings) => {
    if (portfolio) {
      setPortfolio({
        ...portfolio,
        custom_colors: settings.custom_colors,
        slug: settings.slug,
      });
    }
    setShowSettings(false);
  };

  const handleTemplateChange = async (newTemplate: string) => {
    setTemplate(newTemplate);
    try {
      await updateSettings(portfolio!.id, { template: newTemplate });
    } catch (err) {
      console.error('Failed to save template:', err);
    }
  };

  const handleApplyTailoring = async (tailoredSummary: string, highlightedSkills: string[]) => {
    if (!portfolio) return;
    try {
      const updated = await updatePortfolio(portfolio.id, {
        ...portfolio.parsed_data,
        summary: tailoredSummary,
        skills: highlightedSkills,
      });
      setPortfolio(updated);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to apply tailoring:', err);
    }
  };

  const renderTemplate = () => {
    switch (template) {
      case 'modern':
        return (
          <ModernTemplate
            data={portfolio.parsed_data}
            availableForHire={availableForHire}
            darkMode={darkMode}
            photoUrl={portfolio.photo_url}
            customColors={portfolio.custom_colors}
            sectionOrder={portfolio.section_order}
          />
        );
      case 'creative':
        return (
          <CreativeTemplate
            data={portfolio.parsed_data}
            availableForHire={availableForHire}
            darkMode={darkMode}
            photoUrl={portfolio.photo_url}
            customColors={portfolio.custom_colors}
            sectionOrder={portfolio.section_order}
          />
        );
      default:
        return (
          <MinimalTemplate
            data={portfolio.parsed_data}
            availableForHire={availableForHire}
            darkMode={darkMode}
            photoUrl={portfolio.photo_url}
            customColors={portfolio.custom_colors}
            sectionOrder={portfolio.section_order}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-40">
          Portfolio updated! ✓
        </div>
      )}

      {/* Settings Panel */}
      {showSettings && portfolio && (
        <SettingsPanel
          portfolioId={portfolio.id}
          customColors={portfolio.custom_colors}
          slug={portfolio.slug}
          onClose={() => setShowSettings(false)}
          onUpdate={handleSettingsUpdate}
        />
      )}

      {/* QR Code Modal */}
      {showQRCode && portfolio && (
        <QRCodeModal
          portfolioId={portfolio.id}
          slug={portfolio.slug}
          onClose={() => setShowQRCode(false)}
        />
      )}

      {/* Job Customization Modal */}
      {showJobCustomization && portfolio && (
        <JobCustomizationModal
          portfolioId={portfolio.id}
          currentSummary={portfolio.parsed_data.summary}
          currentSkills={portfolio.parsed_data.skills}
          onClose={() => setShowJobCustomization(false)}
          onApply={handleApplyTailoring}
        />
      )}

      {/* AI Suggestions Modal */}
      {showSuggestions && portfolio && (
        <SuggestionsModal
          portfolioId={portfolio.id}
          onClose={() => setShowSuggestions(false)}
        />
      )}

      {/* Edit Modal */}
      {isEditing && portfolio && (
        <EditMode
          data={portfolio.parsed_data}
          portfolioId={portfolio.id}
          photoUrl={portfolio.photo_url}
          sectionOrder={portfolio.section_order}
          onSave={handleSaveEdit}
          onCancel={() => setIsEditing(false)}
          onPhotoUpload={(photoUrl) => {
            setPortfolio({ ...portfolio, photo_url: photoUrl });
          }}
          onSectionOrderUpdate={(order) => {
            setPortfolio({ ...portfolio, section_order: order });
          }}
        />
      )}

      {/* Header with Controls */}
      {!isPreviewMode && (
        <div className="border-b border-slate-200 bg-white/95 backdrop-blur">
          <div className="max-w-7xl mx-auto px-4 py-4 flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="flex items-center gap-5">
              <a href="/" className="text-sm font-semibold text-sky-700 hover:text-sky-800">← New portfolio</a>
              <span className="text-sm text-slate-500 flex items-center gap-1">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {portfolio.view_count ?? 0} {(portfolio.view_count ?? 0) === 1 ? 'view' : 'views'}
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setIsEditing(true)}
                className={actionBtnPrimary}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </button>
              <button
                onClick={() => setIsPreviewMode(true)}
                className={actionBtnAccent}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Preview
              </button>
              <button
                onClick={handleToggleDarkMode}
                className={`inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors ${
                  darkMode
                    ? 'border border-slate-300 bg-slate-900 text-amber-200 hover:bg-slate-800'
                    : 'border border-amber-300 bg-amber-100 text-amber-900 hover:bg-amber-200'
                }`}
              >
                {darkMode ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.64 13a1 1 0 0 0-1.05-.14 8 8 0 1 1 .12-11.5 1 1 0 0 0 1.41 1.41A10 10 0 1 0 23 13a1 1 0 0 0-.36-.86z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 18a6 6 0 1 0-6-6 6 6 0 0 0 6 6zm0-10a4 4 0 1 1-4 4 4 4 0 0 1 4-4zm7-3h-2v2h2zm0 8h-2v2h2zm-6 6v2h2v-2zm-6-2v2h2v-2zM5.22 5.22l-1.41-1.41L6.63 1.4l1.41 1.41zM18.37 18.37l-1.41-1.41 1.41-1.41 1.41 1.41z" />
                  </svg>
                )}
                {darkMode ? 'Dark' : 'Light'}
              </button>
              <button
                onClick={handleToggleAvailableForHire}
                className={`inline-flex h-11 items-center gap-2 rounded-xl px-4 text-sm font-semibold transition-colors ${
                  availableForHire
                    ? 'border border-emerald-300 bg-emerald-50 text-emerald-800 hover:bg-emerald-100'
                    : 'border border-slate-300 bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20 6h-2.18c.3-.6.82-1.13 1.44-1.49.62-.36 1.3-.51 2-1a1 1 0 0 0-1.22-1.6c-1.88 1.12-2.94 3.28-2.97 5.48H9a4 4 0 0 0-4 4v5a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-5a4 4 0 0 0-4-4zm-4 10h-4v2h4v-2z" />
                </svg>
                {availableForHire ? 'Available' : 'Unavailable'}
              </button>
              <button
                onClick={() => setShowSettings(true)}
                className={actionBtn}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Settings
              </button>
              <ShareButton portfolioId={portfolio.id} slug={portfolio.slug} />
              <button
                onClick={() => setShowQRCode(true)}
                className={actionBtn}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm5-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm8-2h8v8h-8v-8zm2 2v4h4v-4h-4z" />
                </svg>
                QR Code
              </button>
              <button
                onClick={() => setShowJobCustomization(true)}
                className={actionBtn}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Tailor for Job
              </button>
              <button
                onClick={() => setShowSuggestions(true)}
                className={actionBtn}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                AI Suggestions
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Template Switcher */}
      {!isPreviewMode && (
        <div className="border-b border-slate-200 bg-slate-50">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <TemplateSwitcher current={template} onChange={handleTemplateChange} />
          </div>
        </div>
      )}

      {/* Portfolio Display */}
      <div className={`flex gap-6 ${isPreviewMode ? '' : 'max-w-7xl mx-auto px-4'} py-8`}>
        {/* Main Portfolio */}
        <div className={isPreviewMode ? 'w-full' : 'flex-1'}>
          <div className={isPreviewMode ? '' : 'bg-white rounded-lg shadow-sm overflow-hidden'}>
            {renderTemplate()}
          </div>
        </div>

        {/* ATS Score Sidebar */}
        {!isPreviewMode && (
          <div className="w-80">
            <AtsScoreCard score={portfolio.ats_score} feedback={portfolio.ats_feedback} />
          </div>
        )}
      </div>

      {/* Preview Mode Exit Button */}
      {isPreviewMode && (
        <button
          onClick={() => setIsPreviewMode(false)}
          className="fixed bottom-6 right-6 inline-flex h-12 items-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white shadow-xl transition-colors hover:bg-slate-800 z-50"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
          Exit Preview
        </button>
      )}
    </div>
  );
}
