import { Logger, LogLevel } from '@nestjs/common';

export type ILogger = (name: string) => Logger;

export const getLogLevels = (prod: boolean): LogLevel[] => {
  if (prod) {
    return ['log', 'warn', 'error'];
  }
  return ['error', 'warn', 'log', 'verbose', 'debug'];
};

export const logger: ILogger = (name: string) => new Logger(name);

export const createLoggerInstance = (context: string): Logger => {
  return new Logger(context);
};

export const logWithContext = (
  context: string,
  message: string,
  level: LogLevel = 'log',
): void => {
  const loggerInstance = createLoggerInstance(context);

  switch (level) {
    case 'error':
      loggerInstance.error(message);
      break;
    case 'warn':
      loggerInstance.warn(message);
      break;
    case 'debug':
      loggerInstance.debug(message);
      break;
    case 'verbose':
      loggerInstance.verbose(message);
      break;
    default:
      loggerInstance.log(message);
  }
};
