import { Injectable } from '@nestjs/common';
import { Logtail } from '@logtail/node';
import { AxiosError } from 'axios';

@Injectable()
export class LoggerService {
  private logtail: Logtail;

  constructor() {
    this.logtail = new Logtail('Ah75gthx2KwCAm234VX3GPd4');
  }

  loggerInfo(msg: string, data: unknown): void {
    try {
      const params = JSON.stringify(data);
      void this.logtail.info(msg, { params });
      void this.logtail.flush();
    } catch (error) {
      console.error(error);
    }
  }

  loggerError(msg: string, data: unknown): void {
    let parsed: unknown;
    if (isAxiosError(data)) {
      parsed = {
        config: data.response?.config,
        data: data.response?.data,
      };
    } else if (
      typeof data === 'object' &&
      data !== null &&
      'response' in data
    ) {
      const resp = (data as { [key: string]: unknown }).response;
      parsed = {
        config: isObject(resp) && 'config' in resp ? resp['config'] : undefined,
        data: isObject(resp) && 'data' in resp ? resp['data'] : undefined,
      };
    } else {
      parsed = data;
    }
    const params = JSON.stringify(parsed);
    try {
      void this.logtail.error(msg, { params });
      void this.logtail.flush();
    } catch (error) {
      console.error(error);
    }
  }

  loggerResponseError(
    action: string,
    msg: string,
    error: unknown,
    request?: unknown,
  ): void {
    const date = new Date();
    const params: Record<string, unknown> = {
      action,
      time: date.toISOString(),
      type: typeof error,
      message: isErrorWithMessage(error) ? error['message'] : undefined,
      name: isErrorWithName(error) ? error['name'] : undefined,
      stack: isErrorWithStack(error) ? error['stack'] : undefined,
      string: errorToString(error),
      req:
        isAxiosError(error) && error.response
          ? {
              response: {
                status: error.response.status,
                data: error.response.data,
                config: error.response.config,
                headers: error.response.headers,
              },
            }
          : {},
    };

    if (isObject(request)) {
      params.req = {
        ...(typeof params.req === 'object' && params.req !== null
          ? params.req
          : {}),
        request: {
          config: 'config' in request ? request['config'] : undefined,
          body: 'body' in request ? request['body'] : undefined,
          params: 'params' in request ? request['params'] : undefined,
          query: 'query' in request ? request['query'] : undefined,
          headers: 'headers' in request ? request['headers'] : undefined,
        },
      };
    }

    this.loggerError(msg, params);
  }
}

function isAxiosError(error: unknown): error is AxiosError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'isAxiosError' in error &&
    (error as { [key: string]: unknown })['isAxiosError'] === true
  );
}

function isErrorWithMessage(error: unknown): error is { message: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { [key: string]: unknown })['message'] === 'string'
  );
}

function isErrorWithName(error: unknown): error is { name: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'name' in error &&
    typeof (error as { [key: string]: unknown })['name'] === 'string'
  );
}

function isErrorWithStack(error: unknown): error is { stack: string } {
  return (
    typeof error === 'object' &&
    error !== null &&
    'stack' in error &&
    typeof (error as { [key: string]: unknown })['stack'] === 'string'
  );
}

function errorToString(error: unknown): string {
  if (typeof error === 'string') return error;
  if (
    error &&
    typeof error === 'object' &&
    'toString' in error &&
    typeof (error as { [key: string]: unknown })['toString'] === 'function'
  ) {
    const fn = (error as { [key: string]: unknown })['toString'];
    if (typeof fn === 'function') {
      const result: unknown = fn.call(error);
      return typeof result === 'string' ? result : '';
    }
  }
  return '';
}

function isObject(val: unknown): val is Record<string, unknown> {
  return typeof val === 'object' && val !== null;
}
