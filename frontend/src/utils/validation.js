export const validateEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

export const validateUsername = (username) => {
  const regex = /^[a-zA-Z0-9_]{4,15}$/; // alphanumeric, 4–15 chars
  return regex.test(username);
};

export const validatePassword = (password) => {
  // At least 8 chars, 1 uppercase, 1 number, 1 special
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
  return regex.test(password);
};
