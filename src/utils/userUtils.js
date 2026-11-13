/**
 * User Profile Helper Utilities
 */

export function getInitials(name) {
  if (!name || typeof name !== 'string') return 'U';
  const trimmed = name.trim();
  if (!trimmed) return 'U';

  const parts = trimmed.split(/\s+/).filter(Boolean);
  if (parts.length === 1) {
    return parts[0].charAt(0).toUpperCase();
  }
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export function getTimeGreeting(name) {
  const hour = new Date().getHours();
  let greeting = 'Good evening';
  if (hour < 12) greeting = 'Good morning';
  else if (hour < 17) greeting = 'Good afternoon';

  const displayName = name && name.trim() ? name.trim() : 'User';
  return `${greeting}, ${displayName}`;
}

export function getTimeGreetingDetails(date = new Date(), name = 'User') {
  const hour = date.getHours();
  let greeting;
  let period;
  let icon;
  let badgeColor;

  if (hour >= 5 && hour < 12) {
    greeting = 'Good Morning';
    period = 'Morning Focus';
    icon = '🌅';
    badgeColor = '#f59e0b';
  } else if (hour >= 12 && hour < 17) {
    greeting = 'Good Afternoon';
    period = 'Afternoon Momentum';
    icon = '☀️';
    badgeColor = '#3b82f6';
  } else if (hour >= 17 && hour < 22) {
    greeting = 'Good Evening';
    period = 'Evening Wrap-up';
    icon = '🌇';
    badgeColor = '#8b5cf6';
  } else {
    greeting = 'Good Night';
    period = 'Night Owl Focus';
    icon = '🌙';
    badgeColor = '#6366f1';
  }

  const displayName = name && name.trim() ? name.trim() : 'User';
  return { greeting, period, icon, badgeColor, displayName };
}

export function getProfileCompletion(user) {
  if (!user) return 0;
  let score = 0;
  if (user.name && user.name.trim() && user.name.trim() !== 'User') score += 35;
  if (user.role && user.role.trim()) score += 25;
  if (user.bio && user.bio.trim()) score += 25;
  if (user.avatarImage) score += 15;
  return Math.min(100, score);
}
