export const getBaseUrl = () => {
  // Use environment variables with defaults
  if(process.env.NODE_ENV === 'development') {
    return process.env.DEV_API_URL || 'http://192.168.1.10:4000';
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
    timeout: 10000, // 10 seconds timeout
    headers: {
      'Content-Type': 'application/json',
    }
  };
};
