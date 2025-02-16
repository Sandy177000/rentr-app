export const getBaseUrl = () => {
  return 'http://192.168.1.42:4000';
  // return 'https://rentr-backend.onrender.com';
};

export const getApiUrl = () => {
  return `${getBaseUrl()}/api`;
};
