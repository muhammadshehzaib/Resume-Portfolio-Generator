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
  const handleDownloadPDF = () => {
    window.print();
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
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
            padding: 0 !important;
          }
          .print-container {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          @page {
            margin: 1cm;
          }
        }
      `}</style>

      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg z-40 no-print">
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

      {/* Header with Controls (Premium Dashboard Aesthetic) */}
      {!isPreviewMode && (
        <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-gray-100 shadow-[0_4px_30px_rgba(0,0,0,0.02)] no-print">
          <div className="max-w-[1600px] mx-auto px-6 h-16 flex items-center justify-between">
            
            {/* Left: Navigation & Stats */}
            <div className="flex items-center gap-8">
              <a href="/" className="group flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-black transition-colors">
                <svg className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Studio
              </a>
              <div className="h-4 w-px bg-slate-200"></div>
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300 flex items-center gap-2">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                {portfolio.view_count ?? 0}
              </span>
            </div>

            {/* Center: Configuration & Toggles */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-50/50 p-1 rounded-md border border-slate-100">
              <button
                onClick={handleToggleDarkMode}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${
                  darkMode ? 'bg-black text-white shadow-sm' : 'text-slate-500 hover:text-black'
                }`}
              >
                Dark Mode
              </button>
              <button
                onClick={handleToggleAvailableForHire}
                className={`flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest transition-all ${
                  availableForHire ? 'bg-emerald-500 text-white shadow-sm' : 'text-slate-500 hover:text-black'
                }`}
              >
                Hireable
              </button>
              <div className="w-px h-3 bg-slate-200 mx-1"></div>
              <button
                onClick={() => setShowSettings(true)}
                className="flex items-center gap-2 px-3 py-1.5 rounded text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-black transition-colors"
                title="Global Settings"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>

            {/* Right: Core Actions */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1 border-r border-slate-100 pr-3">
                <button
                  onClick={() => setShowSuggestions(true)}
                  className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-indigo-500 hover:text-indigo-600 hover:bg-indigo-50 rounded transition-all"
                  title="AI Insights"
                >
                  Insights
                </button>
                <button
                  onClick={() => setShowJobCustomization(true)}
                  className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-black hover:bg-slate-50 rounded transition-all"
                >
                  Tailor
                </button>
                <button
                  onClick={() => setShowQRCode(true)}
                  className="px-3 py-2 text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:text-black hover:bg-slate-50 rounded transition-all"
                >
                  QR
                </button>
                <div className="pt-1"><ShareButton portfolioId={portfolio.id} slug={portfolio.slug} /></div>
              </div>
              
              <button
                onClick={handleDownloadPDF}
                className="px-4 py-2 text-[10px] font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 hover:bg-emerald-100 rounded-sm transition-colors flex items-center gap-2"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                PDF
              </button>
              <button
                onClick={() => setIsPreviewMode(true)}
                className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-sm transition-colors"
              >
                Preview
              </button>
              <button
                onClick={() => setIsEditing(true)}
                className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white bg-black hover:bg-slate-800 rounded-sm transition-all shadow-lg shadow-black/10 hover:-translate-y-px"
              >
                Edit Details
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Template Switcher */}
      {!isPreviewMode && (
        <div className="bg-white border-b border-gray-100 no-print">
          <div className="max-w-[1600px] mx-auto px-6 py-3">
            <TemplateSwitcher current={template} onChange={handleTemplateChange} />
          </div>
        </div>
      )}

      {/* Portfolio Display */}
      <div className={`flex gap-6 ${isPreviewMode ? '' : 'max-w-7xl mx-auto px-4'} py-8 print-container`}>
        {/* Main Portfolio */}
        <div className={isPreviewMode ? 'w-full' : 'flex-1 print-container'}>
          <div className={isPreviewMode ? '' : 'bg-white rounded-lg shadow-sm overflow-hidden border border-gray-100 print-container'}>
            {renderTemplate()}
          </div>
        </div>

        {/* ATS Score Sidebar */}
        {!isPreviewMode && (
          <div className="w-80 no-print">
            <AtsScoreCard score={portfolio.ats_score} feedback={portfolio.ats_feedback} />
          </div>
        )}
      </div>

      {/* Preview Mode Exit Button */}
      {isPreviewMode && (
        <button
          onClick={() => setIsPreviewMode(false)}
          className="fixed bottom-6 right-6 inline-flex h-12 items-center gap-2 rounded-xl bg-slate-900 px-6 text-sm font-semibold text-white shadow-xl transition-colors hover:bg-slate-800 z-50 no-print"
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
