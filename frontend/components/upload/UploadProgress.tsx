'use client';

interface UploadProgressProps {
  status: 'idle' | 'uploading' | 'processing' | 'done' | 'error';
  error?: string;
  fileName?: string;
}

export default function UploadProgress({ status, error, fileName }: UploadProgressProps) {
  if (status === 'idle') return null;

  const steps = [
    { label: 'Uploading', active: ['uploading', 'processing', 'done'] },
    { label: 'Extracting resume data', active: ['processing', 'done'] },
    { label: 'Scoring ATS compatibility', active: ['done'] },
  ];

  return (
    <div className="mt-8 space-y-4">
      {status === 'error' ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-semibold">Error</p>
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      ) : (
        <>
          <p className="text-sm text-gray-600">
            {fileName && <>Processing: <span className="font-mono">{fileName}</span></>}
          </p>
          <div className="space-y-2">
            {steps.map((step, idx) => (
              <div key={idx} className="flex items-center gap-3">
                {steps[idx].active.includes(status) ? (
                  <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                ) : (
                  <div className="w-5 h-5 rounded-full border-2 border-gray-300" />
                )}
                <span className={steps[idx].active.includes(status) ? 'text-gray-700 font-medium' : 'text-gray-500'}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
