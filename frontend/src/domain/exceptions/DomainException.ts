/**
 *
 * Custom exceptions for domain-related errors
 */
export class DomainException extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'DomainException';
  }
}

export class UserNotFoundException extends DomainException {
  constructor(id: string) {
    super(`User with id ${id} not found`);
    this.name = 'UserNotFoundException';
  }
}

export class ValidationException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationException';
  }
}

export class NetworkException extends DomainException {
  constructor(message: string) {
    super(message);
    this.name = 'NetworkException';
  }
}
