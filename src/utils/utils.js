export const formatDate = (date) => {
    const messageDate = new Date(date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (messageDate.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (messageDate.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return messageDate.toLocaleDateString();
    }
};


export const renderDateSeparator = (currentMessage, prevMessage) => {
    if (!prevMessage) {return true;}
    const currentDate = new Date(currentMessage.createdAt).toDateString();
    const prevDate = new Date(prevMessage.createdAt).toDateString();
    return currentDate !== prevDate;
};

export const getTextStyle = variant => {
  switch (variant) {
    case 'h1':
      return {fontSize: 19};
    case 'h2':
      return {fontSize: 17};
    case 'h3':
      return {fontSize: 15};
    case 'h4':
      return {fontSize: 13};
    case 'h5':
      return {fontSize: 11};
    default:
      return {fontSize: 13};
  }
};


export const validatePassword = (password) => {
  const minLength = 8;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (password.length < minLength) {
    return 'Password must be at least 8 characters long';
  }
  if (!hasUpperCase) {
    return 'Password must contain at least one uppercase letter';
  }
  if (!hasLowerCase) {
    return 'Password must contain at least one lowercase letter';
  }
  if (!hasNumbers) {
    return 'Password must contain at least one number';
  }
  if (!hasSpecialChar) {
    return 'Password must contain at least one special character';
  }
  return '';
};

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) ? '' : 'Invalid email address';
};
