/**
 * Format a date to show relative time (e.g., "2 minutes ago", "1 hour ago")
 * @param {Date} date - The date to format
 * @returns {string} - Formatted relative time string
 */
export const formatDistanceToNow = (date) => {
  const now = new Date();
  const diffInMs = now - date;
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInSeconds < 60) {
    return "just now";
  } else if (diffInMinutes < 60) {
    return `${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`;
  } else if (diffInHours < 24) {
    return `${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`;
  } else if (diffInDays < 7) {
    return `${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`;
  } else {
    return date.toLocaleDateString();
  }
};

/**
 * Format a date to a readable string
 * @param {Date} date - The date to format
 * @returns {string} - Formatted date string
 */
export const formatDate = (date) => {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

/**
 * Check if a date is today
 * @param {Date} date - The date to check
 * @returns {boolean} - True if the date is today
 */
export const isToday = (date) => {
  const now = new Date();
  return date.toDateString() === now.toDateString();
};

/**
 * Check if a date is within the last 24 hours
 * @param {Date} date - The date to check
 * @returns {boolean} - True if the date is within the last 24 hours
 */
export const isWithinLast24Hours = (date) => {
  const now = new Date();
  const diffInMs = now - date;
  return diffInMs < 24 * 60 * 60 * 1000;
};
