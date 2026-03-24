'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import DropZone from '@/components/upload/DropZone';
import UploadProgress from '@/components/upload/UploadProgress';
import { uploadResume } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const [status, setStatus] = useState<'idle' | 'uploading' | 'processing' | 'done' | 'error'>('idle');
  const [error, setError] = useState<string>();
  const [fileName, setFileName] = useState<string>();

  const handleFileSelect = async (file: File) => {
    setFileName(file.name);
    setStatus('uploading');
    setError(undefined);

    try {
      const portfolio = await uploadResume(file);
      setStatus('done');
      setTimeout(() => {
        router.push(`/portfolio/${portfolio.id}`);
      }, 500);
    } catch (err) {
      setStatus('error');
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-4xl mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Resume to Portfolio</h1>
          <p className="text-xl text-gray-600 mb-2">Upload your resume, let AI generate a stunning portfolio</p>
          <p className="text-gray-500">Features: AI extraction • ATS scoring • Shareable link</p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl mb-3">🧠</div>
            <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Extraction</h3>
            <p className="text-sm text-gray-600">Intelligent parsing of your resume into structured data</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl mb-3">📊</div>
            <h3 className="font-semibold text-gray-900 mb-2">ATS Scoring</h3>
            <p className="text-sm text-gray-600">Get feedback on how well your resume passes ATS systems</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="text-2xl mb-3">🔗</div>
            <h3 className="font-semibold text-gray-900 mb-2">Shareable Link</h3>
            <p className="text-sm text-gray-600">Generate a unique portfolio link to share with anyone</p>
          </div>
        </div>

        {/* Upload Section */}
        <div className="bg-white p-8 rounded-lg shadow-md border border-gray-200">
          <DropZone onFileSelect={handleFileSelect} disabled={status !== 'idle'} />
          <UploadProgress status={status} error={error} fileName={fileName} />
        </div>
      </div>
    </div>
  );
}
