import { projectId, publicAnonKey } from './supabase/info';

const API_BASE = `https://${projectId}.supabase.co/functions/v1/make-server-4192bdc4`;

// Get session token from localStorage
export function getSessionToken(): string | null {
  const token = localStorage.getItem('skillup_session_token');
  if (token) {
    console.log(`Session token found: ${token.substring(0, 10)}...`);
  }
  return token;
}

// Set session token in localStorage
export function setSessionToken(token: string): void {
  console.log(`Setting session token: ${token.substring(0, 10)}...`);
  localStorage.setItem('skillup_session_token', token);
}

// Clear session token from localStorage
export function clearSessionToken(): void {
  console.log('Clearing session token');
  localStorage.removeItem('skillup_session_token');
}

// Make API request with authorization
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = getSessionToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Always send publicAnonKey in Authorization header (required by Supabase Edge Functions)
  // Send custom session token in X-Session-Token header (for our app logic)
  headers['Authorization'] = `Bearer ${publicAnonKey}`;
  
  if (token) {
    console.log(`API Request to ${endpoint} with session token`);
    headers['X-Session-Token'] = token;
  } else {
    console.log(`API Request to ${endpoint} without session token`);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    console.error(`API Error on ${endpoint}:`, error);
    throw new Error(error.error || `HTTP ${response.status}`);
  }

  return response.json();
}

// ==================== AUTH API ====================

export async function signUp(fullName: string, email: string, password: string) {
  const data = await apiRequest('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ fullName, email, password }),
  });
  
  if (data.success && data.session_token) {
    console.log("Setting session token after signup");
    setSessionToken(data.session_token);
  } else {
    console.error("No session token in signup response:", data);
  }
  
  return data;
}

export async function login(email: string, password: string) {
  const data = await apiRequest('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  if (data.success && data.session_token) {
    console.log("Setting session token after login");
    setSessionToken(data.session_token);
  } else {
    console.error("No session token in login response:", data);
  }
  
  return data;
}

export async function adminLogin(email: string, password: string) {
  const data = await apiRequest('/auth/admin-login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
  
  if (data.success && data.session_token) {
    setSessionToken(data.session_token);
  }
  
  return data;
}

export async function verifySession() {
  try {
    // Only call if we have a token
    const token = getSessionToken();
    if (!token) {
      console.log("No session token found, skipping verification");
      return null;
    }
    
    const data = await apiRequest('/auth/session');
    
    // Backend returns success: false when session is invalid
    if (!data.success || !data.session) {
      console.log("Session is invalid or expired");
      clearSessionToken();
      return null;
    }
    
    return data.session;
  } catch (error) {
    console.log("Session verification failed, clearing token");
    clearSessionToken();
    return null;
  }
}

export async function logout() {
  try {
    await apiRequest('/auth/logout', { method: 'POST' });
  } catch (error) {
    console.error("Logout API error:", error);
    // Still clear token even if API call fails
  } finally {
    clearSessionToken();
  }
}

// ==================== USER API ====================

export async function getUserProfile() {
  const data = await apiRequest('/user/profile');
  return data.profile;
}

export async function updateModuleProgress(
  moduleId: string,
  completed: boolean,
  progressPercentage: number,
  moduleName?: string
) {
  const data = await apiRequest('/user/progress', {
    method: 'POST',
    body: JSON.stringify({ moduleId, completed, progressPercentage, moduleName }),
  });
  return data;
}

export async function getUserModules() {
  const token = getSessionToken();
  console.log("getUserModules - Session token exists:", !!token);
  if (token) {
    console.log("Token preview:", token.substring(0, 15) + "...");
  }
  
  const data = await apiRequest('/user/modules');
  return data.progress;
}

// ==================== ASSESSMENT API ====================

export async function generateAIAssessment() {
  const data = await apiRequest('/ai/generate-assessment', {
    method: 'POST',
  });
  return data.questions;
}

export async function analyzeAssessmentWithAI(responses: any[]) {
  const data = await apiRequest('/ai/analyze-assessment', {
    method: 'POST',
    body: JSON.stringify({ responses }),
  });
  return data.analysis;
}

export async function getAssessmentResults() {
  try {
    const data = await apiRequest('/assessment/results');
    return data.assessment;
  } catch (error) {
    return null;
  }
}

// ==================== FEEDBACK API ====================

export async function submitFeedback(message: string, category: string = 'general') {
  const data = await apiRequest('/feedback/submit', {
    method: 'POST',
    body: JSON.stringify({ message, category }),
  });
  return data;
}

export async function getAllFeedback() {
  const data = await apiRequest('/feedback/all');
  return data.feedback;
}

export async function updateFeedbackStatus(feedbackId: string, status: string) {
  const data = await apiRequest(`/feedback/${feedbackId}`, {
    method: 'PUT',
    body: JSON.stringify({ status }),
  });
  return data;
}

// ==================== ADMIN API ====================

export async function getAdminStats() {
  const data = await apiRequest('/admin/stats');
  return data.stats;
}

export async function getAllUsers() {
  const data = await apiRequest('/admin/users');
  return data.users;
}

export async function updateUser(userId: string, updates: { email?: string; full_name?: string; password?: string }) {
  const data = await apiRequest(`/admin/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return data.user;
}

export async function deleteUser(userId: string) {
  const data = await apiRequest(`/admin/users/${userId}`, {
    method: 'DELETE',
  });
  return data;
}

export async function getAnalytics() {
  const data = await apiRequest('/admin/analytics');
  return data.analytics;
}

// ==================== AI/GEMINI API ====================

export async function generateAIModules(careerPath?: string, hasAssessment: boolean = false) {
  const data = await apiRequest('/ai/generate-modules', {
    method: 'POST',
    body: JSON.stringify({ careerPath, hasAssessment }),
  });
  return data.modules;
}

export async function generateAILesson(moduleTitle: string, moduleDescription?: string) {
  const data = await apiRequest('/ai/generate-lesson', {
    method: 'POST',
    body: JSON.stringify({ moduleTitle, moduleDescription }),
  });
  return data.lesson;
}

// ==================== RESOURCES API ====================

export async function getAllResources() {
  const data = await apiRequest('/resources');
  return data.resources;
}

export async function addResource(resource: {
  name: string;
  type: string;
  address?: string;
  contact?: string;
  latitude?: number;
  longitude?: number;
}) {
  const data = await apiRequest('/resources', {
    method: 'POST',
    body: JSON.stringify(resource),
  });
  return data.resource;
}

export async function updateResource(resourceId: string, updates: any) {
  const data = await apiRequest(`/resources/${resourceId}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return data.resource;
}

export async function deleteResource(resourceId: string) {
  await apiRequest(`/resources/${resourceId}`, {
    method: 'DELETE',
  });
}

// ==================== PROFILE API ====================

export async function updateUserProfile(updates: {
  full_name?: string;
  email?: string;
  current_password?: string;
  new_password?: string;
}) {
  const data = await apiRequest('/user/profile', {
    method: 'PUT',
    body: JSON.stringify(updates),
  });
  return data.profile;
}

// ==================== SEED DATA ====================

export async function createAdminAccount() {
  const data = await apiRequest('/seed/admin', { method: 'POST' });
  return data;
}
