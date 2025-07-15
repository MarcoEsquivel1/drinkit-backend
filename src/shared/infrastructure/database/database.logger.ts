import { Logger as NestLogger } from '@nestjs/common';
import { Logger as TypeOrmLogger } from 'typeorm';

export class DatabaseLogger implements TypeOrmLogger {
  private readonly logger = new NestLogger('DATABASE');

  logQuery(query: string, parameters?: unknown[]): void {
    const params = this.stringifyParameters(parameters);
    this.logger.verbose(`${query} ${params ? `-- Parameters: ${params}` : ''}`);
  }

  logQueryError(error: string, query: string, parameters?: unknown[]): void {
    const params = this.stringifyParameters(parameters);
    this.logger.error(
      `QUERY ERROR - ${query} ${params ? `-- Parameters: ${params}` : ''} -- ${error}`,
    );
  }

  logQuerySlow(time: number, query: string, parameters?: unknown[]): void {
    const params = this.stringifyParameters(parameters);
    this.logger.verbose(
      `QUERY SLOW - Time: ${time} -- ${query} ${params ? `-- Parameters: ${params}` : ''}`,
    );
  }

  logMigration(message: string): void {
    this.logger.debug(message);
  }

  logSchemaBuild(message: string): void {
    this.logger.debug(message);
  }

  log(level: 'log' | 'info' | 'warn', message: string): void {
    if (level === 'log') {
      return this.logger.verbose(message);
    }
    if (level === 'info') {
      return this.logger.debug(message);
    }
    if (level === 'warn') {
      return this.logger.warn(message);
    }
  }

  private stringifyParameters(parameters?: unknown[]): string {
    try {
      return JSON.stringify(parameters);
    } catch {
      return '';
    }
  }
}
