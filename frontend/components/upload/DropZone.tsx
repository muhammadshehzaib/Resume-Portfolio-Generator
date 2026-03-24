'use client';

import { useRef } from 'react';

interface DropZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export default function DropZone({ onFileSelect, disabled }: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('border-blue-500', 'bg-blue-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.remove('border-blue-500', 'bg-blue-50');

    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type === 'application/pdf') {
        onFileSelect(file);
      } else {
        alert('Please drop a PDF file');
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      onFileSelect(e.target.files[0]);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className="border-2 border-dashed border-gray-300 rounded-lg p-12 text-center cursor-pointer transition-colors"
      onClick={() => inputRef.current?.click()}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".pdf"
        onChange={handleFileInput}
        className="hidden"
        disabled={disabled}
      />
      <svg
        className="w-12 h-12 mx-auto mb-4 text-gray-400"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M12 4v16m8-8H4"
        />
      </svg>
      <p className="text-lg font-semibold text-gray-700">Drag & drop your resume</p>
      <p className="text-sm text-gray-500">or click to select a PDF file</p>
      <p className="text-xs text-gray-400 mt-2">Max file size: 10 MB</p>
    </div>
  );
}
