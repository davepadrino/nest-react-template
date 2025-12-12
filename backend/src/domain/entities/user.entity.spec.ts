import { User } from './user.entity';

describe('User Entity', () => {
  describe('create', () => {
    it('creates a valid user', () => {
      const user = User.create('John Doe', 'john@example.com', 'New York', new Date('1990-05-15'));

      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
      expect(user.city).toBe('New York');
      expect(user.id).toBeDefined();
      expect(user.createdAt).toBeDefined();
      expect(user.updatedAt).toBeDefined();
    });

    it('throws error for empty name', () => {
      expect(() => {
        User.create('', 'john@example.com');
      }).toThrow('User name cannot be empty');
    });

    it('throws error for invalid email', () => {
      expect(() => {
        User.create('John Doe', 'invalid-email');
      }).toThrow('Invalid email format');
    });
  });

  describe('updateName', () => {
    it('updates user name', () => {
      const user = User.create('John Doe', 'john@example.com');
      const oldUpdatedAt = user.updatedAt;

      // Wait a bit to ensure timestamp changes
      setTimeout(() => {
        user.updateName('Jane Doe');
        expect(user.name).toBe('Jane Doe');
        expect(user.updatedAt.getTime()).toBeGreaterThanOrEqual(oldUpdatedAt.getTime());
      }, 10);
    });

    it('throws error for empty name', () => {
      const user = User.create('John Doe', 'john@example.com');
      expect(() => {
        user.updateName('');
      }).toThrow('User name cannot be empty');
    });
  });

  describe('updateEmail', () => {
    it('updates user email', () => {
      const user = User.create('John Doe', 'john@example.com');
      user.updateEmail('newemail@example.com');
      expect(user.email).toBe('newemail@example.com');
    });

    it('throws error for invalid email', () => {
      const user = User.create('John Doe', 'john@example.com');
      expect(() => {
        user.updateEmail('invalid-email');
      }).toThrow('Invalid email format');
    });
  });

  describe('toObject', () => {
    it('converts entity to plain object', () => {
      const user = User.create('John Doe', 'john@example.com', 'New York');
      const obj = user.toObject();

      expect(obj).toEqual({
        id: expect.any(String),
        name: 'John Doe',
        email: 'john@example.com',
        city: 'New York',
        birthDate: undefined,
        createdAt: expect.any(Date),
        updatedAt: expect.any(Date),
      });
    });
  });
});
