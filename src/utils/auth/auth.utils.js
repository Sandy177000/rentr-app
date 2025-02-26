export const registerFormInputFields = [
  {
    label: 'First Name',
    key: 'firstName',
    placeholder: 'Enter your first name',
  },
  {
    label: 'Last Name',
    key: 'lastName',
    placeholder: 'Enter your last name',
  },
  {
    label: 'Email',
    key: 'email',
    placeholder: 'Enter your email',
  },
  {
    label: 'Password',
    key: 'password',
    placeholder: 'Enter your password',
    secureTextEntry: true,
  },
  {
    label: 'Confirm Password',
    key: 'confirmPassword',
    placeholder: 'Confirm your password',
    secureTextEntry: true,
  },
];

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
