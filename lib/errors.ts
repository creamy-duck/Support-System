export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Validation failed') {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export function handleApiError(error: unknown): { message: string; statusCode: number } {
  if (error instanceof AppError) {
    return { message: error.message, statusCode: error.statusCode };
  }
  if (error instanceof Error) {
    if (error.message === 'Unauthorized') return { message: 'Unauthorized', statusCode: 401 };
    if (error.message === 'Forbidden') return { message: 'Forbidden', statusCode: 403 };
    if (error.message === 'Ticket not found') return { message: 'Ticket not found', statusCode: 404 };
    return { message: error.message, statusCode: 500 };
  }
  return { message: 'Internal server error', statusCode: 500 };
}
