export const evaluatePasswordStrength = (password) => {
  let score = 0;
  if (!password) return '';

  if (password.length >= 6) score += 1;
  if (password.length >= 8) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;

  if (score <= 2) return { label: 'Débil', color: '#ff4d4f' };
  if (score <= 4) return { label: 'Regular', color: '#faad14' };
  return { label: 'Fuerte', color: '#52c41a' };
};