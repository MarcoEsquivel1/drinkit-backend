import { Injectable } from '@nestjs/common';
import { Logtail } from '@logtail/node';

@Injectable()
export class LoggerService {
  private logtail: Logtail;

  constructor() {
    this.logtail = new Logtail('Ah75gthx2KwCAm234VX3GPd4');
  }

  loggerInfo(msg: string, data: any): void {
    const params = JSON.stringify(data);
    try {
      this.logtail.info(msg, { params });
      this.logtail.flush();
    } catch (error) {
      console.log(error);
    }
  }

  loggerError(msg: string, data: any): void {
    const parsed = data?.response
      ? { config: data?.response?.config, data: data?.response?.data }
      : data;
    const params = JSON.stringify(parsed);
    try {
      this.logtail.error(msg, { params });
      this.logtail.flush();
    } catch (error) {
      console.log(error);
    }
  }

  loggerResponseError(
    action: string,
    msg: string,
    error: any,
    request: any = null,
  ): void {
    const date = new Date();
    const params = {
      action,
      time: date.toISOString(),
      type: typeof error,
      message: error?.message,
      name: error?.name,
      stack: error?.stack,
      string: error.toString(),
      req: error?.response
        ? {
            response: {
              status: error?.response?.status,
              data: error?.response?.data,
              config: error?.response?.config,
              headers: error?.response?.headers,
            },
          }
        : {},
    };

    if (request) {
      params.req = {
        ...params.req,
        request: {
          config: request?.config,
          body: request?.body,
          params: request?.params,
          query: request?.query,
          headers: request?.headers,
        },
      } as any;
    }

    this.loggerError(msg, params);
  }
}
