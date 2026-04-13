import { PortfolioResponse, ParsedResume, PortfolioSettings, TailorResult, SuggestionResult, RankingJobResponse } from './types';


const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  let userId = window.localStorage.getItem('rp_user_id');
  if (!userId) {
    userId = `user_${crypto.randomUUID()}`;
    window.localStorage.setItem('rp_user_id', userId);
  }

  return { Authorization: `Bearer ${userId}` };
}

export async function uploadResume(file: File): Promise<PortfolioResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Upload failed' }));
    throw new Error(error.detail || 'Upload failed');
  }

  return response.json();
}

export async function getPortfolio(id: string): Promise<PortfolioResponse> {
  const response = await fetch(`${API_URL}/api/portfolio/${id}`);

  if (!response.ok) {
    throw new Error('Portfolio not found');
  }

  return response.json();
}

export async function updatePortfolio(id: string, data: ParsedResume): Promise<PortfolioResponse> {
  const response = await fetch(`${API_URL}/api/portfolio/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Update failed' }));
    throw new Error(error.detail || 'Update failed');
  }

  return response.json();
}

export async function uploadPhoto(id: string, file: File): Promise<PortfolioResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/api/portfolio/${id}/photo`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Photo upload failed' }));
    throw new Error(error.detail || 'Photo upload failed');
  }

  return response.json();
}

export async function updateSettings(id: string, settings: PortfolioSettings): Promise<PortfolioResponse> {
  const response = await fetch(`${API_URL}/api/portfolio/${id}/settings`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify(settings),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Settings update failed' }));
    throw new Error(error.detail || 'Settings update failed');
  }

  return response.json();
}

export async function getPortfolioBySlug(slug: string): Promise<PortfolioResponse> {
  const response = await fetch(`${API_URL}/api/p/${slug}`);

  if (!response.ok) {
    throw new Error('Portfolio not found');
  }

  return response.json();
}

export async function getPortfolioMeta(id: string): Promise<PortfolioResponse> {
  const response = await fetch(`${API_URL}/api/portfolio/${id}/meta`);

  if (!response.ok) {
    throw new Error('Portfolio not found');
  }

  return response.json();
}

export async function getPortfolioMetaBySlug(slug: string): Promise<PortfolioResponse> {
  const response = await fetch(`${API_URL}/api/p/${slug}/meta`);

  if (!response.ok) {
    throw new Error('Portfolio not found');
  }

  return response.json();
}

export async function tailorPortfolio(id: string, jobDescription: string): Promise<TailorResult> {
  const response = await fetch(`${API_URL}/api/portfolio/${id}/tailor`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ job_description: jobDescription }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Tailoring failed' }));
    throw new Error(error.detail || 'Tailoring failed');
  }

  return response.json();
}

export async function checkSlugAvailability(slug: string, excludeId: string): Promise<{ available: boolean }> {
  const response = await fetch(`${API_URL}/api/slug/check?slug=${encodeURIComponent(slug)}&exclude_id=${encodeURIComponent(excludeId)}`);
  if (!response.ok) throw new Error('Failed to check slug availability');
  return response.json();
}

export async function getPortfolioSuggestions(id: string): Promise<SuggestionResult> {
  const response = await fetch(`${API_URL}/api/portfolio/${id}/suggestions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
  });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Analysis failed' }));
    throw new Error(error.detail || 'Analysis failed');
  }
  return response.json();
}

export async function downloadPortfolioPDF(id: string, fileName: string = 'Resume.pdf'): Promise<void> {
  const response = await fetch(`${API_URL}/api/portfolio/${id}/pdf`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to generate PDF');
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}

export async function rankResumes(jobDescription: string, files: File[]): Promise<RankingJobResponse> {
  const formData = new FormData();
  formData.append('job_description', jobDescription);
  files.forEach((file) => formData.append('files', file));

  const response = await fetch(`${API_URL}/api/ranking/rank`, {
    method: 'POST',
    headers: getAuthHeaders(),
    body: formData,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Ranking failed' }));
    throw new Error(error.detail || 'Ranking failed');
  }

  return response.json();
}

export async function getRankingJobs(): Promise<RankingJobResponse[]> {
  const response = await fetch(`${API_URL}/api/ranking/jobs`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch ranking jobs');
  }

  return response.json();
}
