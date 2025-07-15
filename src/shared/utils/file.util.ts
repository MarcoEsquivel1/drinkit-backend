import { generateSlug } from './text.util';

export const filename = (data: any): string => {
  const now = Date.now();
  const cleanDate = data?.day?.replace(/\//g, '') || '';
  const cleanName = data?.name ? generateSlug(data.name) : '';
  return `${now}-${cleanDate}-${cleanName}`;
};

export const getFilenameFromUrl = (url: string): string => {
  try {
    let parsedUrl: URL;
    try {
      parsedUrl = new URL(url);
    } catch {
      parsedUrl = new URL('https://' + url);
    }
    const pathname = parsedUrl.pathname;
    return pathname.substring(pathname.lastIndexOf('/') + 1);
  } catch {
    return '';
  }
};

export const getFileExtension = (filename: string): string => {
  const lastDot = filename.lastIndexOf('.');
  return lastDot !== -1 ? filename.substring(lastDot + 1).toLowerCase() : '';
};

export const removeFileExtension = (filename: string): string => {
  const lastDot = filename.lastIndexOf('.');
  return lastDot !== -1 ? filename.substring(0, lastDot) : filename;
};

export const isValidFileType = (
  filename: string,
  allowedTypes: string[],
): boolean => {
  const extension = getFileExtension(filename);
  return allowedTypes.includes(extension);
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const generateUniqueFilename = (
  originalName: string,
  timestamp?: number,
): string => {
  const now = timestamp || Date.now();
  const extension = getFileExtension(originalName);
  const nameWithoutExt = removeFileExtension(originalName);
  const slugName = generateSlug(nameWithoutExt);

  return extension ? `${now}-${slugName}.${extension}` : `${now}-${slugName}`;
};

export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_{2,}/g, '_')
    .replace(/^_+|_+$/g, '');
};

export const isImageFile = (filename: string): boolean => {
  const imageTypes = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'svg'];
  return isValidFileType(filename, imageTypes);
};

export const isDocumentFile = (filename: string): boolean => {
  const documentTypes = [
    'pdf',
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    'txt',
  ];
  return isValidFileType(filename, documentTypes);
};

export const createFileUrl = (baseUrl: string, filename: string): string => {
  const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  return `${cleanBaseUrl}/${filename}`;
};
