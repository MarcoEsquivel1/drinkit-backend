export const removeSymbols = (text: string): string => {
  const regex = /[^a-zA-Z0-9 ]/g;
  return text.replace(regex, '');
};

export const generateSlug = (text: string): string => {
  let slug = text.toLowerCase();
  slug = removeSymbols(slug);
  slug = slug.replace(/\s+/g, '-').replace(/-+/g, '-');
  slug = slug.replace(/^-+|-+$/g, '');
  return slug;
};

export const formatNIT = (nit: string): string => {
  const value = nit.replace(/\s+/g, '').replace(/-/g, '');

  const isDUI = value.length === 9;
  if (isDUI) return formatDUI(value);

  const regex = /^(\d{4})(\d{6})(\d{3})(\d{1})$/;
  const match = value.match(regex);
  return match ? match.slice(1).join('-') : '';
};

export const formatDUI = (dui: string): string => {
  const value = dui.replace(/\s+/g, '').replace(/-/g, '');
  const matches = value.match(/.{1,8}/g);
  return matches ? matches.join('-') : '';
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const normalizeString = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();
};

export const normalizePhone = (phone?: string): string => {
  return phone?.replace(/\D/g, '') || '';
};

export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const capitalizeWords = (str: string): string => {
  return str.replace(
    /\w\S*/g,
    (txt) => txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(),
  );
};

export const truncateText = (
  text: string,
  maxLength: number,
  suffix = '...',
): string => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength - suffix.length) + suffix;
};

export const removeAccents = (str: string): string => {
  return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
};

export const cleanText = (text: string): string => {
  return text
    .replace(/[^\w\s]/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

export const extractNumbers = (text: string): string => {
  return text.replace(/\D/g, '');
};

export const maskEmail = (email: string): string => {
  const [name, domain] = email.split('@');
  if (name.length <= 2) return email;

  const maskedName =
    name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
  return `${maskedName}@${domain}`;
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, '');

  if (cleaned.length === 8) {
    return `${cleaned.slice(0, 4)}-${cleaned.slice(4)}`;
  }

  if (cleaned.length === 11 && cleaned.startsWith('503')) {
    return `+${cleaned.slice(0, 3)} ${cleaned.slice(3, 7)}-${cleaned.slice(7)}`;
  }

  return phone;
};
