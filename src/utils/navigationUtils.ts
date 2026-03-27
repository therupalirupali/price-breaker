// Simple navigation utilities for client-side routing
export const Navigate = (path: string) => {
  window.location.href = path;
};

// Token management utilities
export const TokenManager = {
  getToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  setToken: (token: string): void => {
    localStorage.setItem('authToken', token);
  },

  removeToken: (): void => {
    localStorage.removeItem('authToken');
  },

  isTokenExpired: (token: string): boolean => {
    try {
      const parts = token.split('.');
      if (parts.length !== 3) return true;

      const payload = JSON.parse(atob(parts[1]));
      return payload.exp * 1000 < Date.now();
    } catch {
      return true;
    }
  },
};

// API utility for making authenticated requests
export const apiRequest = async (
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const token = TokenManager.getToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (options.headers instanceof Headers) {
    options.headers.forEach((value, key) => {
      headers[key] = value;
    });
  } else if (options.headers && typeof options.headers === 'object') {
    Object.assign(headers, options.headers);
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return fetch(url, {
    ...options,
    headers,
  });
};
