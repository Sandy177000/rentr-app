export const getBaseUrl = () => {
  return 'http://192.168.1.10:4000';
  // return 'https://rentr-backend.onrender.com';
};

export const getApiUrl = () => {
  return `${getBaseUrl()}/api`;
};
