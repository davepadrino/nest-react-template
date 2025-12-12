import { User } from './User';

describe('User Entity', () => {
  const mockUserData = {
    id: '123',
    name: 'John Doe',
    email: 'john@example.com',
    city: 'New York',
    birthDate: '1990-05-15',
    createdAt: '2023-01-01T00:00:00.000Z',
    updatedAt: '2023-01-01T00:00:00.000Z',
  };

  describe('fromDTO', () => {
    it('should create a User instance from DTO', () => {
      const user = User.fromDTO(mockUserData);

      expect(user.id).toBe('123');
      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.city).toBe('New York');
      expect(user.birthDate).toBeInstanceOf(Date);
    });

    it('should handle optional fields', () => {
      const minimalData = {
        id: '123',
        name: 'John Doe',
        email: 'john@example.com',
        createdAt: '2023-01-01T00:00:00.000Z',
        updatedAt: '2023-01-01T00:00:00.000Z',
      };

      const user = User.fromDTO(minimalData);

      expect(user.city).toBeUndefined();
      expect(user.birthDate).toBeUndefined();
    });
  });

  describe('getAge', () => {
    it('should calculate age correctly', () => {
      const user = User.fromDTO(mockUserData);
      const age = user.getAge();

      expect(age).toBeGreaterThan(30); // Assuming current year is > 2020
      expect(age).toBeLessThan(100);
    });

    it('should return null if birthDate is not set', () => {
      const userData = { ...mockUserData, birthDate: undefined };
      const user = User.fromDTO(userData);

      expect(user.getAge()).toBeNull();
    });
  });

  describe('getFormattedBirthDate', () => {
    it('should format birth date', () => {
      const user = User.fromDTO(mockUserData);
      const formatted = user.getFormattedBirthDate();

      expect(formatted).toBeTruthy();
      expect(typeof formatted).toBe('string');
    });

    it('should return null if birthDate is not set', () => {
      const userData = { ...mockUserData, birthDate: undefined };
      const user = User.fromDTO(userData);

      expect(user.getFormattedBirthDate()).toBeNull();
    });
  });
});
