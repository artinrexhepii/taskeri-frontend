/**
 * Formatters for displaying dates, numbers, and other data types
 */

/**
 * Formats a date string to a localized date format (e.g., "May 19, 2025")
 * @param dateString - ISO date string to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted date string
 */
export const formatDate = (dateString: string, locale = 'en-US'): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return dateString;
  }
};

/**
 * Formats a date string to a localized date and time format (e.g., "May 19, 2025, 2:30 PM")
 * @param dateString - ISO date string to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted date and time string
 */
export const formatDateTime = (dateString: string, locale = 'en-US'): string => {
  if (!dateString) return '';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString(locale, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric'
    });
  } catch (error) {
    console.error('Error formatting datetime:', error);
    return dateString;
  }
};

/**
 * Formats a number as currency
 * @param amount - Number to format
 * @param currency - Currency code (default: 'USD')
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency = 'USD', locale = 'en-US'): string => {
  if (amount === null || amount === undefined || isNaN(amount)) return '';
  
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency
    }).format(amount);
  } catch (error) {
    console.error('Error formatting currency:', error);
    return amount.toString();
  }
};

/**
 * Formats a number with commas for thousands
 * @param num - Number to format
 * @param locale - Locale for formatting (default: 'en-US')
 * @returns Formatted number string
 */
export const formatNumber = (num: number, locale = 'en-US'): string => {
  if (num === null || num === undefined || isNaN(num)) return '';
  
  try {
    return new Intl.NumberFormat(locale).format(num);
  } catch (error) {
    console.error('Error formatting number:', error);
    return num.toString();
  }
};

/**
 * Formats a duration in minutes to hours and minutes
 * @param minutes - Duration in minutes
 * @returns Formatted duration string (e.g., "2h 30m")
 */
export const formatDuration = (minutes: number): string => {
  if (minutes === null || minutes === undefined || isNaN(minutes)) return '';
  
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
};

/**
 * Formats a user's name (first + last)
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns Formatted full name
 */
export const formatUserName = (firstName?: string, lastName?: string): string => {
  if (!firstName && !lastName) return '';
  if (!firstName) return lastName || '';
  if (!lastName) return firstName || '';
  
  return `${firstName} ${lastName}`;
};

/**
 * Creates initials from a user's name
 * @param firstName - User's first name
 * @param lastName - User's last name
 * @returns Initials (e.g., "JD" for "John Doe")
 */
export const getInitials = (firstName?: string, lastName?: string): string => {
  let initials = '';
  
  if (firstName) initials += firstName.charAt(0).toUpperCase();
  if (lastName) initials += lastName.charAt(0).toUpperCase();
  
  return initials;
};

/**
 * Formats a byte size into human-readable format (e.g., "2.5 MB", "450 KB")
 * @param bytes - Number of bytes to format
 * @param decimals - Decimal places for rounding (default: 2)
 * @returns Formatted file size string with units
 */
export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
};