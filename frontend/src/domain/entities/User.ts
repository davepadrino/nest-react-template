/**
 *
 * Frontend domain entity representing a User
 */
export class User {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly email: string,
    public readonly createdAt: Date,
    public readonly updatedAt: Date,
    public readonly city?: string,
    public readonly birthDate?: Date,
  ) {}

  // TODO: improve typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static fromDTO(dto: any): User {
    return new User(
      dto.id,
      dto.name,
      dto.email,
      new Date(dto.createdAt),
      new Date(dto.updatedAt),
      dto.city,
      dto.birthDate ? new Date(dto.birthDate) : undefined,
    );
  }

  getAge(): number | null {
    if (!this.birthDate) return null;
    const today = new Date();
    let age = today.getFullYear() - this.birthDate.getFullYear();
    const monthDiff = today.getMonth() - this.birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < this.birthDate.getDate())) {
      age--;
    }
    return age;
  }

  getFormattedBirthDate(): string | null {
    if (!this.birthDate) return null;
    return this.birthDate.toLocaleDateString();
  }
}
