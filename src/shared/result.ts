export type Result<T> =
  | {
      ok: true;
      value: T;
    }
  | {
      ok: false;
      message: string;
    };

export function ok<T>(value: T): Result<T> {
  return { ok: true, value };
}

export function err<T = never>(message: string): Result<T> {
  return { ok: false, message };
}

export function messageFromError(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback;
}
