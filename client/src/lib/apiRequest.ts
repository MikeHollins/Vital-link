// Simple API request function that handles JSON requests
export async function apiRequest(url: string, options: RequestInit = {}) {
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  if (options.body && typeof options.body === 'object') {
    defaultOptions.body = JSON.stringify(options.body);
  }

  const response = await fetch(url, defaultOptions);
  
  if (!response.ok) {
    throw new Error(`${response.status}: ${response.statusText}`);
  }
  
  return response.json();
}