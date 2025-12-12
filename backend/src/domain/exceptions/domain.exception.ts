/**
 *
 * Base exception for domain-related errors
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

export class UserAlreadyExistsException extends DomainException {
  constructor(email: string) {
    super(`User with email ${email} already exists`);
    this.name = 'UserAlreadyExistsException';
  }
}
