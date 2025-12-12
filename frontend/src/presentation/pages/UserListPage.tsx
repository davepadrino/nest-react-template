import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { User } from '@domain/entities/User';
import { useDependencies } from '../context/DependencyContext';
import { ErrorHandler } from '@infrastructure/error/ErrorHandler';
import { Logger } from '@infrastructure/logging/Logger';
import UserCard from '../components/UserCard';
import UserForm from '../components/UserForm';
import {
  Container,
  Header,
  Title,
  Subtitle,
  Grid,
  ErrorMessage,
  LoadingSpinner,
} from '../styles/common';

const Section = styled.section`
  margin-bottom: 3rem;
`;

const SectionTitle = styled.h2`
  color: #333;
  margin-bottom: 1rem;
`;

const logger = new Logger('UserListPage');

const UserListPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const { getAllUsersUseCase, createUserUseCase, deleteUserUseCase } = useDependencies();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      logger.log('Fetching users...');
      const fetchedUsers = await getAllUsersUseCase.execute();
      setUsers(fetchedUsers);
      logger.log('Users fetched successfully', { count: fetchedUsers.length });
    } catch (err) {
      const errorMessage = ErrorHandler.getUserFriendlyMessage(err);
      setError(errorMessage);
      logger.error('Failed to fetch users', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // TODO: improve typing
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleCreateUser = async (data: any) => {
    try {
      setCreating(true);
      setError(null);
      logger.log('Creating user...', data);
      await createUserUseCase.execute(data);
      logger.log('User created successfully');
      await fetchUsers();
    } catch (err) {
      const errorMessage = ErrorHandler.getUserFriendlyMessage(err);
      setError(errorMessage);
      logger.error('Failed to create user', err);
    } finally {
      setCreating(false);
    }
  };

  const handleDeleteUser = async (id: string) => {
    if (!confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      setError(null);
      logger.log('Deleting user...', { id });
      await deleteUserUseCase.execute(id);
      logger.log('User deleted successfully');
      await fetchUsers();
    } catch (err) {
      const errorMessage = ErrorHandler.getUserFriendlyMessage(err);
      setError(errorMessage);
      logger.error('Failed to delete user', err);
    }
  };

  return (
    <Container>
      <Header>
        <Title>NestJS + React Template</Title>
        <Subtitle>Full-stack application following DDD architecture</Subtitle>
      </Header>

      {error && <ErrorMessage>{error}</ErrorMessage>}

      <Section>
        <SectionTitle>Create New User</SectionTitle>
        <UserForm onSubmit={handleCreateUser} loading={creating} />
      </Section>

      <Section>
        <SectionTitle>Users ({users.length})</SectionTitle>
        {loading ? (
          <LoadingSpinner>Loading users...</LoadingSpinner>
        ) : users.length === 0 ? (
          <p>No users found. Create one above!</p>
        ) : (
          <Grid>
            {users.map((user) => (
              <UserCard key={user.id} user={user} onDelete={handleDeleteUser} />
            ))}
          </Grid>
        )}
      </Section>
    </Container>
  );
};

export default UserListPage;
