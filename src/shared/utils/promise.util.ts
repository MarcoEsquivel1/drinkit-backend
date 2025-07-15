export const wait = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const fail = (error: string): Promise<never> => {
  return new Promise((_resolve, reject) =>
    setTimeout(() => reject(error), 1500),
  );
};

export const randomDelay = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const waitRandom = (
  min: number = 700,
  max: number = 3000,
): Promise<void> => {
  const delay = randomDelay(min, max);
  return wait(delay);
};

export const timeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) =>
      setTimeout(
        () => reject(new Error(`Operation timed out after ${ms}ms`)),
        ms,
      ),
    ),
  ]);
};

export const retry = async <T>(
  fn: () => Promise<T>,
  maxAttempts: number = 3,
  delayMs: number = 1000,
): Promise<T> => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error as Error;

      if (attempt === maxAttempts) {
        throw lastError;
      }

      await wait(delayMs * attempt);
    }
  }

  throw lastError!;
};

export const withTimeout = async <T>(
  promise: Promise<T>,
  ms: number,
  timeoutMessage?: string,
): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error(timeoutMessage || `Operation timed out after ${ms}ms`));
    }, ms);
  });

  return Promise.race([promise, timeoutPromise]);
};

export const promiseAllSettled = async <T>(
  promises: Promise<T>[],
): Promise<
  Array<{ status: 'fulfilled' | 'rejected'; value?: T; reason?: any }>
> => {
  return Promise.allSettled(promises).then((results) =>
    results.map((result) => {
      if (result.status === 'fulfilled') {
        return { status: 'fulfilled', value: result.value };
      } else {
        return { status: 'rejected', reason: result.reason };
      }
    }),
  );
};

export const mapAsync = async <T, R>(
  array: T[],
  asyncFn: (item: T, index: number) => Promise<R>,
  concurrency: number = 3,
): Promise<R[]> => {
  const results: R[] = [];
  const executing: Promise<void>[] = [];

  for (let i = 0; i < array.length; i++) {
    const promise = asyncFn(array[i], i).then((result) => {
      results[i] = result;
    });

    executing.push(promise);

    if (executing.length >= concurrency || i === array.length - 1) {
      await Promise.all(executing);
      executing.length = 0;
    }
  }

  return results;
};

export const delayedResolve = <T>(value: T, delayMs: number): Promise<T> => {
  return new Promise((resolve) => setTimeout(() => resolve(value), delayMs));
};

export const delayedReject = (
  error: string | Error,
  delayMs: number,
): Promise<never> => {
  return new Promise((_, reject) =>
    setTimeout(
      () => reject(typeof error === 'string' ? new Error(error) : error),
      delayMs,
    ),
  );
};
