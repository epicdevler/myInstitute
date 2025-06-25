export class AppException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AppException';
  }
}

export class NotFoundException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'NotFoundException';
  }
}

export class ValidationException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationException';
  }
}

export class UnauthorizedException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'UnauthorizedException';
  }
}

export class ForbiddenException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'ForbiddenException';
  }
}

export class ConflictException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'ConflictException';
  }
}

export class InternalServerErrorException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'InternalServerErrorException';
  }
}

export class ServiceUnavailableException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'ServiceUnavailableException';
  }
}

export class BadRequestException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'BadRequestException';
  }
}



/**
 * All exceptions related to authentication.
 * These exceptions are used to handle errors that occur during the authentication process.
 */
export class AuthenticationException extends AppException {
  constructor(message: string) {
    super(message);
    this.name = 'AuthenticationException';
  }

}
export class InvalidCredentialsException extends AuthenticationException {
  constructor(message: string) {
    super(message);
    this.name = 'InvalidCredentialsException';
  }
}
export class UserAlreadyExistsException extends AuthenticationException {
    constructor(message: string) {
      super(message);
      this.name = 'UserAlreadyExistsException';
    }
}

export class UserNotFoundException extends AuthenticationException {
  constructor(message: string) {
    super(message);
    this.name = 'UserNotFoundException';
  }
}

