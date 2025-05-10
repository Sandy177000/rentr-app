export const getBaseUrl = () => {
  // Use environment variables with defaults
  return 'http://192.168.1.16:4000';
  // return 'https://rentr-backend.onrender.com';
};

export const getApiUrl = () => {
  return `${getBaseUrl()}/api`;
};

// Add timeout and retry functionality
export const getApiConfig = () => {
  return {
    baseURL: getApiUrl(),
    timeout: 30000, // 30 seconds timeout
    headers: {
      'Content-Type': 'application/json',
    }
  };
};
