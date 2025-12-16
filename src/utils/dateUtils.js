import { format, parseISO, isToday, isPast, differenceInDays, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

export const formatDate = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy');
  } catch {
    return dateString;
  }
};

export const formatDateTime = (dateString) => {
  if (!dateString) return '';
  try {
    return format(parseISO(dateString), 'MMM dd, yyyy HH:mm');
  } catch {
    return dateString;
  }
};

export const isDeadlineToday = (dateString) => {
  if (!dateString) return false;
  try {
    return isToday(parseISO(dateString));
  } catch {
    return false;
  }
};

export const isDeadlinePast = (dateString) => {
  if (!dateString) return false;
  try {
    return isPast(parseISO(dateString)) && !isToday(parseISO(dateString));
  } catch {
    return false;
  }
};

export const getDaysUntil = (dateString) => {
  if (!dateString) return null;
  try {
    return differenceInDays(parseISO(dateString), new Date());
  } catch {
    return null;
  }
};

export const isThisWeek = (dateString) => {
  if (!dateString) return false;
  try {
    const date = parseISO(dateString);
    const start = startOfWeek(new Date());
    const end = endOfWeek(new Date());
    return isWithinInterval(date, { start, end });
  } catch {
    return false;
  }
};

export const getDeadlineStatus = (dateString) => {
  if (!dateString) return { status: 'none', label: 'No deadline', color: 'text-gray-500' };

  if (isDeadlinePast(dateString)) {
    return { status: 'overdue', label: 'Overdue', color: 'text-red-600' };
  }

  if (isDeadlineToday(dateString)) {
    return { status: 'today', label: 'Today', color: 'text-orange-600' };
  }

  const days = getDaysUntil(dateString);
  if (days <= 3) {
    return { status: 'soon', label: `${days} days`, color: 'text-yellow-600' };
  }

  return { status: 'future', label: formatDate(dateString), color: 'text-gray-600' };
};
