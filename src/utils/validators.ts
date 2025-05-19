/**
 * Validators for form inputs and data validation
 */

/**
 * Validates email format
 * @param email - Email string to validate
 * @returns Boolean indicating if email is valid
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates password meets requirements
 * @param password - Password string to validate
 * @returns Boolean indicating if password is valid
 */
export const isValidPassword = (password: string): boolean => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validates date format (YYYY-MM-DD)
 * @param date - Date string to validate
 * @returns Boolean indicating if date is valid
 */
export const isValidDate = (date: string): boolean => {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(date)) return false;

  const parsedDate = new Date(date);
  return !isNaN(parsedDate.getTime());
};

/**
 * Validates URL format
 * @param url - URL string to validate
 * @returns Boolean indicating if URL is valid
 */
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * Validates if a value is not empty
 * @param value - Value to check
 * @returns Boolean indicating if value is not empty
 */
export const isNotEmpty = (value: string | null | undefined): boolean => {
  return value !== null && value !== undefined && value.trim() !== '';
};

/**
 * Validates if a value is a valid number
 * @param value - Value to check
 * @returns Boolean indicating if value is a valid number
 */
export const isValidNumber = (value: any): boolean => {
  if (typeof value === 'number') return !isNaN(value);
  if (typeof value === 'string') return !isNaN(Number(value));
  return false;
};

/**
 * Validates a string is within allowed length
 * @param str - String to validate
 * @param min - Minimum length
 * @param max - Maximum length
 * @returns Boolean indicating if string length is valid
 */
export const isValidLength = (str: string, min: number, max: number): boolean => {
  return str.length >= min && str.length <= max;
};