/**
 * Base application exception.
 * Extend this for all custom exceptions in the app.
 */
export class AppException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppException';
  }
}

/**
 * Exception for network request errors.
 */
export class NetworkRequestException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkRequestException';
  }
}

/**
 * Exception for GET method network request errors.
 */
export class GetMethodNetworkRequestException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'GetMethodNetworkRequestException';
  }
}

/**
 * Exception for POST method network request errors.
 */
export class PostMethodNetworkRequestException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'PostMethodNetworkRequestException';
  }
}

/**
 * Exception for not found errors (404).
 */
export class NotFoundException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundException';
  }
}

/**
 * Exception for validation errors.
 */
export class ValidationException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationException';
  }
}

/**
 * Exception for unauthorized access errors (401).
 */
export class UnauthorizedException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedException';
  }
}

/**
 * Exception for forbidden access errors (403).
 */
export class ForbiddenException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenException';
  }
}

/**
 * Exception for conflict errors (409).
 */
export class ConflictException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictException';
  }
}

/**
 * Exception for internal server errors (500).
 */
export class InternalServerErrorException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'InternalServerErrorException';
  }
}

/**
 * Exception for service unavailable errors (503).
 */
export class ServiceUnavailableException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'ServiceUnavailableException';
  }
}

/**
 * Exception for bad request errors (400).
 */
export class BadRequestException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestException';
  }
}

/**
 * All exceptions related to authentication.
 * Extend this for authentication-specific errors.
 */
export class AuthenticationException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationException';
  }
}

/**
 * Exception for invalid credentials during authentication.
 */
export class InvalidCredentialsException extends AuthenticationException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCredentialsException';
  }
}

/**
 * Exception for user already exists errors during authentication.
 */
export class UserAlreadyExistsException extends AuthenticationException {
  constructor(message: string) {
    super(message);
    this.name = 'UserAlreadyExistsException';
  }
}

/**
 * Exception for user not found errors during authentication.
 */
export class UserNotFoundException extends AuthenticationException {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotFoundException';
  }
}

