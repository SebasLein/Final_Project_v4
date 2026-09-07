export class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export class NotFoundError extends AppError {
  constructor(message = 'Recurso no encontrado') {
    super(message, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message = 'Conflicto con el estado actual del recurso') {
    super(message, 409);
  }
}

export class ForbiddenError extends AppError {
  constructor(message = 'No tienes permisos para esta acción') {
    super(message, 403);
  }
}
