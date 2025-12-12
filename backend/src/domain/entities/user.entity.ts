import { randomUUID } from 'crypto';

/**
 *  From Application (Use cases), return to application to infrastructure (database, external services)
 *
 * This is the core business entity with all business logic and invariants.
 */
export class User {
  private readonly _id: string;
  private _name: string;
  private _email: string;
  private _city?: string;
  private _birthDate?: Date;
  private readonly _createdAt: Date;
  private _updatedAt: Date;

  constructor(
    id: string,
    name: string,
    email: string,
    createdAt: Date,
    updatedAt: Date,
    city?: string,
    birthDate?: Date,
  ) {
    this._id = id;
    this._name = name;
    this._email = email;
    this._city = city;
    this._birthDate = birthDate;
    this._createdAt = createdAt;
    this._updatedAt = updatedAt;

    this.validate();
  }

  // Factory method to create a new user
  static create(name: string, email: string, city?: string, birthDate?: Date): User {
    const now = new Date();
    const id = randomUUID();
    return new User(id, name, email, now, now, city, birthDate);
  }

  get id(): string {
    return this._id;
  }

  get name(): string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get city(): string | undefined {
    return this._city;
  }

  get birthDate(): Date | undefined {
    return this._birthDate;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._updatedAt;
  }

  // Business methods
  updateName(name: string): void {
    this._name = name;
    this._updatedAt = new Date();
    this.validate();
  }

  updateEmail(email: string): void {
    this._email = email;
    this._updatedAt = new Date();
    this.validate();
  }

  updateCity(city: string): void {
    this._city = city;
    this._updatedAt = new Date();
  }

  updateBirthDate(birthDate: Date): void {
    this._birthDate = birthDate;
    this._updatedAt = new Date();
  }

  // Domain validation (business rules)
  private validate(): void {
    if (!this._name || this._name.trim().length === 0) {
      throw new Error('User name cannot be empty');
    }

    if (!this._email || !this.isValidEmail(this._email)) {
      throw new Error('Invalid email format');
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  toObject() {
    return {
      id: this._id,
      name: this._name,
      email: this._email,
      city: this._city,
      birthDate: this._birthDate,
      createdAt: this._createdAt,
      updatedAt: this._updatedAt,
    };
  }
}
