import { 
  PortfolioResponse, ParsedResume, PortfolioSettings, TailorResult, 
  SuggestionResult, RankingJobResponse, AnalyticsResponse, TokenResponse, UserResponse,
  JobMatchResponse, CoverLetterResponse
} from './types';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

function getAuthHeaders(): Record<string, string> {
  if (typeof window === 'undefined') return {};

  const token = window.localStorage.getItem('rp_token');
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }

  let userId = window.localStorage.getItem('rp_user_id');
  if (!userId) {
    userId = `user_${crypto.randomUUID()}`;
    window.localStorage.setItem('rp_user_id', userId);
  }

  return { Authorization: `Bearer ${userId}` };
}

export async function loginUser(email: string, password: string): Promise<TokenResponse> {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Incorrect email or password.' }));
    throw new Error(error.detail || 'Login failed');
  }

  return response.json();
}

export async function signupUser(name: string, email: string, password: string, role: string): Promise<UserResponse> {
  const response = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ name, email, password, role }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Registration failed.' }));
    throw new Error(error.detail || 'Signup failed');
  }

  return response.json();
}

export async function getPortfolioAnalytics(id: string): Promise<AnalyticsResponse> {
  const response = await fetch(`${API_URL}/api/portfolio/${id}/analytics`, {
    headers: getAuthHeaders(),
  });

  if (!response.ok) {
    throw new Error('Failed to fetch analytics');
  }

  return response.json();
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

export async function chatWithPortfolioAI(
  idOrSlug: string,
  message: string,
  chatHistory: Array<{ role: string; content: string }> = []
): Promise<{ reply: string }> {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
  const endpoint = isUuid
    ? `${API_URL}/api/portfolio/${idOrSlug}/chat`
    : `${API_URL}/api/p/${idOrSlug}/chat`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({
      message,
      chat_history: chatHistory,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'AI Request failed' }));
    throw new Error(error.detail || 'Failed to get AI response');
  }

  return response.json();
}

export async function analyzeJobMatch(
  portfolioId: string,
  jobDescription: string
): Promise<JobMatchResponse> {
  const response = await fetch(`${API_URL}/api/portfolio/${portfolioId}/job-match`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ job_description: jobDescription }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Job Match analysis failed' }));
    throw new Error(error.detail || 'Failed to analyze job match');
  }

  return response.json();
}

export async function generateCoverLetter(
  portfolioId: string,
  jobDescription: string
): Promise<CoverLetterResponse> {
  const response = await fetch(`${API_URL}/api/portfolio/${portfolioId}/cover-letter`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
    },
    body: JSON.stringify({ job_description: jobDescription }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Cover Letter generation failed' }));
    throw new Error(error.detail || 'Failed to generate cover letter');
  }

  return response.json();
}


