import { hasProperty } from './object.util';

type AuditData = {
  id?: string;
  name?: string;
  surname?: string;
  role?: string;
};

export const genAuditField = (data: AuditData): string => {
  const user = [
    ...(hasProperty(data, 'id') ? [data.id] : []),
    ...(hasProperty(data, 'name') ? [data.name] : []),
    ...(hasProperty(data, 'surname') ? [data.surname] : []),
    ...(hasProperty(data, 'role') ? [data.role] : []),
  ].join('|');
  return user ? user : '0|System|User|root';
};

export const createAuditString = (
  userId: string,
  userName: string,
  action: string,
  timestamp?: Date,
): string => {
  const date = timestamp || new Date();
  return `${userId}|${userName}|${action}|${date.toISOString()}`;
};

export const parseAuditString = (
  auditString: string,
): {
  userId: string;
  userName: string;
  action: string;
  timestamp: string;
} | null => {
  const parts = auditString.split('|');
  if (parts.length >= 4) {
    return {
      userId: parts[0],
      userName: parts[1],
      action: parts[2],
      timestamp: parts[3],
    };
  }
  return null;
};

export const formatAuditInfo = (data: AuditData, action?: string): string => {
  const baseInfo = genAuditField(data);
  return action ? `${baseInfo}|${action}` : baseInfo;
};
