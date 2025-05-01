export const getBaseUrl = () => {
  // Use environment variables with defaults
  if(process.env.NODE_ENV === 'development') {
    return 'http://10.0.2.2:4000';
  }
  return process.env.PROD_API_URL || 'https://rentr-backend.onrender.com';
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
