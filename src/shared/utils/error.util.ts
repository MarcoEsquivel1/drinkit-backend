import 'dotenv/config';

// import { Logtail } from '@logtail/node';
import { Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { EntityNotFoundError, QueryFailedError } from 'typeorm';

// const KEY = process.env.LOGTAIL_KEY || '';
// const logtail = new Logtail(KEY);

type ErrorLng = 'es' | 'en';

interface ErrorMsg {
  [key: number]: string;
}

interface ErrorData {
  name?: string;
  message?: string;
  code?: string;
}

interface LogData {
  level: string;
  message: string;
  status?: number;
  stack?: string;
  timestamp: string;
  error?: ErrorData;
  data?: unknown;
}

interface CustomError extends Error {
  status?: number;
}

export const httpErrorMsg: Record<ErrorLng, Partial<ErrorMsg>> = {
  es: {
    200: 'El servidor devolvió exitosamente los datos solicitados.',
    201: 'Se crearon o modificaron datos correctamente.',
    202: 'Una solicitud ha entrado en la cola en segundo plano (tarea asincrónica).',
    204: 'Se han eliminado los datos correctamente.',
    400: 'Hubo un error en la solicitud enviada y el servidor no creó ni modificó datos.',
    401: 'El usuario no está autorizado, intente iniciar sesión nuevamente.',
    403: 'El usuario está autorizado, pero el acceso está prohibido.',
    404: 'La solicitud enviada es para un registro que no existe y el servidor no lo procesó.',
    406: 'El formato solicitado no está disponible.',
    410: 'El recurso solicitado se ha eliminado permanentemente y ya no está disponible.',
    422: 'Al crear un objeto, ocurrió un error de validación.',
    500: 'Se produjo un error en el servidor, verifique el servidor.',
    502: 'Error de puerta de enlace.',
    503: 'El servicio no está disponible, el servidor está temporalmente sobrecargado o en mantenimiento.',
    504: 'Se agotó el tiempo de espera de la puerta de enlace.',
  },
  en: {
    200: 'The server successfully returned the requested data.',
    201: 'Create or modify data successfully.',
    202: 'A request has entered the background queue (asynchronous task).',
    204: 'Delete data successfully.',
    400: 'There was an error in the request sent, and the server did not create or modify data.',
    401: 'The user does not have permission, please try to login again.',
    403: 'The user is authorized, but access is forbidden.',
    404: 'The request sent is for a record that does not exist, and the server is not operating.',
    406: 'The requested format is not available.',
    410: 'The requested resource has been permanently deleted and will no longer be available.',
    422: 'When creating an object, a validation error occurred.',
    500: 'An error occurred in the server, please check the server.',
    502: 'Gateway error.',
    503: 'The service is unavailable, the server is temporarily overloaded or maintained.',
    504: 'The gateway has timed out.',
  },
};

const logError = (e: unknown, message?: string, status?: number): void => {
  const logData: LogData = {
    level: 'error',
    message: message || (e instanceof Error ? e.message : 'Unknown error'),
    status:
      status ||
      (typeof e === 'object' &&
      e !== null &&
      'status' in e &&
      typeof (e as Record<string, unknown>).status === 'number'
        ? ((e as Record<string, unknown>).status as number)
        : 500),
    stack: e instanceof Error ? e.stack : undefined,
    timestamp: new Date().toISOString(),
    error: {
      name: e instanceof Error ? e.name : undefined,
      message: e instanceof Error ? e.message : undefined,
      code:
        typeof e === 'object' && e !== null && 'code' in e
          ? String((e as Record<string, unknown>).code)
          : undefined,
    },
  };

  // if (KEY) {
  //   logtail.error(logData.message, logData);
  // }

  console.error('Error logged:', logData);
};

export const handleError = (
  err: unknown,
  logger: Logger,
  msg?: string,
): {
  status: number;
  result: {
    success: boolean;
    message: string;
  };
} => {
  let status = 500;
  let message = httpErrorMsg.es[500] as string;

  if (err instanceof AxiosError) {
    status = err.response?.status || 500;
    const responseData = err.response?.data as Record<string, unknown>;
    const responseMessage =
      typeof responseData === 'object' &&
      responseData !== null &&
      'message' in responseData
        ? String(responseData.message)
        : undefined;
    message =
      responseMessage || err.message || (httpErrorMsg.es[status] as string);
  } else if (err instanceof EntityNotFoundError) {
    status = 404;
    message = httpErrorMsg.es[404] as string;
  } else if (err instanceof QueryFailedError) {
    status = 400;
    message = `Error en consulta de base de datos: ${err.message}`;
  } else if (
    typeof err === 'object' &&
    err !== null &&
    'status' in err &&
    typeof (err as Record<string, unknown>).status === 'number'
  ) {
    const errorObj = err as Record<string, unknown>;
    const statusValue = errorObj.status;
    const messageValue = errorObj.message;

    if (typeof statusValue === 'number') {
      status = statusValue;
    }

    if (typeof messageValue === 'string') {
      message = messageValue;
    } else {
      message = httpErrorMsg.es[status] as string;
    }
  } else if (err instanceof Error) {
    message = err.message;
  }

  const errorMessage = msg || message;

  logError(err, errorMessage, status);
  logger.error(errorMessage, (err as Error).stack);

  return {
    status,
    result: {
      success: false,
      message: errorMessage,
    },
  };
};

export const createError = (
  status: number,
  message?: string,
  lng: ErrorLng = 'es',
): CustomError => {
  const errorMessage =
    message || (httpErrorMsg[lng][status] as string) || 'Error desconocido';
  const error = new Error(errorMessage) as CustomError;
  error.status = status;
  return error;
};

export const logInfo = (message: string, data?: unknown): void => {
  const logData: LogData = {
    level: 'info',
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  // if (KEY) {
  //   logtail.info(message, logData);
  // }

  console.log('Info logged:', logData);
};

export const logWarning = (message: string, data?: unknown): void => {
  const logData: LogData = {
    level: 'warn',
    message,
    data,
    timestamp: new Date().toISOString(),
  };

  // if (KEY) {
  //   logtail.warn(message, logData);
  // }

  console.warn('Warning logged:', logData);
};
