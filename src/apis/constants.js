export const getBaseUrl = () => {
  // return 'http://172.16.16.248:4000'
  return 'http://192.168.37.201:4000';
  // return 'https://rentr-backend.onrender.com';
};

export const getApiUrl = () => {
  return `${getBaseUrl()}/api`;
};
