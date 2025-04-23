export const getBaseUrl = () => {

  if(process.env.NODE_ENV === 'development') {
    return 'http://192.168.1.11:4000';
  }
  return 'https://rentr-backend.onrender.com';
};

export const getApiUrl = () => {
  return `${getBaseUrl()}/api`;
};
