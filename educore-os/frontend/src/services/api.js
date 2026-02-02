import { getAuthToken, logout } from '../utils/auth';

// Remove trailing slash from API_URL to prevent double slashes
const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:3000').replace(/\/$/, '');

// API request wrapper with authentication
const apiRequest = async (endpoint, options = {}) => {
  const token = getAuthToken();
  
  const config = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    // Handle unauthorized (401) - token expired or invalid
    if (response.status === 401) {
      logout();
      throw new Error('Session expired. Please login again.');
    }
    
    // Handle forbidden (403) - insufficient permissions
    if (response.status === 403) {
      throw new Error('You do not have permission to perform this action.');
    }
    
    // Parse response
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'An error occurred');
    }
    
    return data;
  } catch (error) {
    console.error('API Request Error:', error);
    
    // Provide more helpful error messages
    if (error.message === 'Failed to fetch') {
      throw new Error('Cannot connect to server. Please ensure the backend is running at ' + API_URL);
    }
    
    throw error;
  }
};

// Authentication API
export const authAPI = {
  // Login with email and password
  login: async (email, password) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },
  
  // Verify token
  verifyToken: async () => {
    return apiRequest('/auth/verify', {
      method: 'GET',
    });
  },
  
  // Get user profile
  getProfile: async () => {
    return apiRequest('/auth/profile', {
      method: 'GET',
    });
  },
  
  // Logout (optional backend call)
  logout: async () => {
    // Could call backend to invalidate token
    // For now, just clear local storage
    logout();
  },
};

// Portal API
export const portalAPI = {
  // Validate portal exists
  validatePortal: async (portalId) => {
    // Mock for now - replace with actual API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ exists: true, name: `${portalId} Secondary School` });
      }, 500);
    });
  },
};

// Students API
export const studentsAPI = {
  // Get all students
  getAll: async (filters = {}) => {
    const queryString = new URLSearchParams(filters).toString();
    return apiRequest(`/students?${queryString}`, {
      method: 'GET',
    });
  },
  
  // Get student by ID
  getById: async (id) => {
    return apiRequest(`/students/${id}`, {
      method: 'GET',
    });
  },
  
  // Create student
  create: async (studentData) => {
    return apiRequest('/students', {
      method: 'POST',
      body: JSON.stringify(studentData),
    });
  },
  
  // Update student
  update: async (id, studentData) => {
    return apiRequest(`/students/${id}`, {
      method: 'PUT',
      body: JSON.stringify(studentData),
    });
  },
  
  // Delete student
  delete: async (id) => {
    return apiRequest(`/students/${id}`, {
      method: 'DELETE',
    });
  },
};

// Results API
export const resultsAPI = {
  // Get pending approvals
  getPendingApprovals: async () => {
    return apiRequest('/results/pending', {
      method: 'GET',
    });
  },
  
  // Submit results
  submit: async (resultData) => {
    return apiRequest('/results/submit', {
      method: 'POST',
      body: JSON.stringify(resultData),
    });
  },
  
  // Approve results
  approve: async (resultId) => {
    return apiRequest(`/results/${resultId}/approve`, {
      method: 'POST',
    });
  },
  
  // Reject results
  reject: async (resultId, reason) => {
    return apiRequest(`/results/${resultId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  },
};

export default {
  auth: authAPI,
  portal: portalAPI,
  students: studentsAPI,
  results: resultsAPI,
};
