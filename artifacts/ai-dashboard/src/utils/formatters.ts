export const formatBytes = (bytes: number, decimals = 2) => {
  if (!+bytes) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  }).format(date);
};

export const formatRelativeTime = (dateStr: string) => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const diffInMs = new Date(dateStr).getTime() - Date.now();
  const diffInDays = Math.round(diffInMs / (1000 * 60 * 60 * 24));
  
  if (Math.abs(diffInDays) > 30) {
    return formatDate(dateStr);
  }
  
  if (Math.abs(diffInDays) < 1) {
    const diffInHours = Math.round(diffInMs / (1000 * 60 * 60));
    if (Math.abs(diffInHours) < 1) {
      const diffInMinutes = Math.round(diffInMs / (1000 * 60));
      return rtf.format(diffInMinutes, 'minute');
    }
    return rtf.format(diffInHours, 'hour');
  }
  
  return rtf.format(diffInDays, 'day');
};

export const formatNumber = (num: number) => {
  return new Intl.NumberFormat('en-US').format(num);
};
