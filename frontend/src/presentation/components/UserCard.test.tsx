import { render, screen } from '@testing-library/react';
import UserCard from './UserCard';
import { User } from '@domain/entities/User';

describe('UserCard', () => {
  const mockUser = new User(
    '123',
    'John Doe',
    'john@example.com',
    new Date('2023-01-01'),
    new Date('2023-01-01'),
    'New York',
    new Date('1990-05-15'),
  );

  it('should render user information', () => {
    render(<UserCard user={mockUser} />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
    expect(screen.getByText('john@example.com')).toBeInTheDocument();
    expect(screen.getByText(/New York/)).toBeInTheDocument();
  });

  it('should render delete button when onDelete is provided', () => {
    const onDelete = jest.fn();
    render(<UserCard user={mockUser} onDelete={onDelete} />);

    const deleteButton = screen.getByText('Delete');
    expect(deleteButton).toBeInTheDocument();
  });

  it('should not render delete button when onDelete is not provided', () => {
    render(<UserCard user={mockUser} />);

    const deleteButton = screen.queryByText('Delete');
    expect(deleteButton).not.toBeInTheDocument();
  });
});
