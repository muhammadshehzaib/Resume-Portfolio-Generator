import { PortfolioResponse, ParsedResume, PortfolioSettings, TailorResult } from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function uploadResume(file: File): Promise<PortfolioResponse> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/api/upload`, {
    method: 'POST',
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
