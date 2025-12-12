import React from 'react';
import styled from 'styled-components';
import { User } from '@domain/entities/User';

const CardContainer = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.2s,
    box-shadow 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const UserName = styled.h3`
  margin: 0 0 0.5rem 0;
  color: #333;
`;

const UserEmail = styled.p`
  color: #666;
  margin: 0.25rem 0;
  font-size: 0.9rem;
`;

const UserInfo = styled.p`
  color: #888;
  margin: 0.25rem 0;
  font-size: 0.85rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const Button = styled.button<{ variant?: 'danger' }>`
  padding: 0.4rem 0.8rem;
  font-size: 0.85rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: ${(props) => (props.variant === 'danger' ? '#dc3545' : '#007bff')};
  color: white;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.8;
  }
`;

interface Props {
  user: User;
  onDelete?: (id: string) => void;
}

const UserCard: React.FC<Props> = ({ user, onDelete }) => {
  return (
    <CardContainer>
      <UserName>{user.name}</UserName>
      <UserEmail>{user.email}</UserEmail>
      {user.city && <UserInfo>📍 {user.city}</UserInfo>}
      {user.birthDate && (
        <UserInfo>
          🎂 {user.getFormattedBirthDate()} ({user.getAge()} years old)
        </UserInfo>
      )}
      <UserInfo>Created: {user.createdAt.toLocaleDateString()}</UserInfo>
      {onDelete && (
        <ButtonGroup>
          <Button variant="danger" onClick={() => onDelete(user.id)}>
            Delete
          </Button>
        </ButtonGroup>
      )}
    </CardContainer>
  );
};

export default UserCard;
