/**
 * Date & Time utility functions for Task Scheduling & Filtering
 */

export function isToday(dateString) {
  if (!dateString) return false;
  const d = new Date(dateString);
  const now = new Date();
  return (
    d.getDate() === now.getDate() &&
    d.getMonth() === now.getMonth() &&
    d.getFullYear() === now.getFullYear()
  );
}

export function isTomorrow(dateString) {
  if (!dateString) return false;
  const d = new Date(dateString);
  const tom = new Date();
  tom.setDate(tom.getDate() + 1);
  return (
    d.getDate() === tom.getDate() &&
    d.getMonth() === tom.getMonth() &&
    d.getFullYear() === tom.getFullYear()
  );
}

export function isOverdue(dateString, timeString = null) {
  if (!dateString) return false;
  const now = new Date();
  let target = new Date(dateString);
  
  if (timeString) {
    const [h, m] = timeString.split(':');
    target.setHours(parseInt(h, 10), parseInt(m, 10), 0, 0);
  } else {
    // End of that date
    target.setHours(23, 59, 59, 999);
  }
  
  return target.getTime() < now.getTime();
}

export function isUpcoming(dateString) {
  if (!dateString) return false;
  const d = new Date(dateString);
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return d.getTime() > now.getTime();
}

export function formatDueDate(dateString, timeString = null) {
  if (!dateString) return null;
  
  if (isToday(dateString)) {
    return timeString ? `Today at ${formatTime(timeString)}` : 'Today';
  }
  
  if (isTomorrow(dateString)) {
    return timeString ? `Tomorrow at ${formatTime(timeString)}` : 'Tomorrow';
  }
  
  const d = new Date(dateString);
  const options = { month: 'short', day: 'numeric' };
  if (d.getFullYear() !== new Date().getFullYear()) {
    options.year = 'numeric';
  }
  const dateFormatted = d.toLocaleDateString('en-US', options);
  return timeString ? `${dateFormatted}, ${formatTime(timeString)}` : dateFormatted;
}

export function formatTime(timeStr) {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  let hour = parseInt(h, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  hour = hour % 12 || 12;
  return `${hour}:${m} ${ampm}`;
}

export function getDayName(offset = 0) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d.toLocaleDateString('en-US', { weekday: 'short' });
}

export function getISOStringForInput(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatCompletionTimestamp(dateInput) {
  if (!dateInput) return '';
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return '';
  const now = new Date();

  const isSameDay = (d1, d2) => (
    d1.getDate() === d2.getDate() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getFullYear() === d2.getFullYear()
  );

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);

  const timeStr = d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

  if (isSameDay(d, now)) {
    return `Today at ${timeStr}`;
  }
  if (isSameDay(d, yesterday)) {
    return `Yesterday at ${timeStr}`;
  }

  const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  return `${dateStr} at ${timeStr}`;
}
