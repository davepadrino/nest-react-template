import React, { useState } from 'react';
import styled from 'styled-components';
import { CreateUserData } from '@domain/repositories/IUserRepository';

const FormContainer = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: #333;
`;

const Input = styled.input`
  padding: 0.5rem;
  font-size: 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;

  &:focus {
    outline: none;
    border-color: #007bff;
  }
`;

const Button = styled.button`
  padding: 0.75rem;
  font-size: 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background-color: #28a745;
  color: white;
  transition: opacity 0.2s;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

interface Props {
  onSubmit: (data: CreateUserData) => Promise<void>;
  loading?: boolean;
}

const UserForm: React.FC<Props> = ({ onSubmit, loading = false }) => {
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
    city: '',
    birthDate: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);

    setFormData({ name: '', email: '', city: '', birthDate: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGroup>
        <Label htmlFor="name">Name *</Label>
        <Input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="email">Email *</Label>
        <Input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          required
          disabled={loading}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="city">City</Label>
        <Input
          id="city"
          name="city"
          type="text"
          value={formData.city}
          onChange={handleChange}
          disabled={loading}
        />
      </FormGroup>

      <FormGroup>
        <Label htmlFor="birthDate">Birth Date</Label>
        <Input
          id="birthDate"
          name="birthDate"
          type="date"
          value={formData.birthDate}
          onChange={handleChange}
          disabled={loading}
        />
      </FormGroup>

      <Button type="submit" disabled={loading}>
        {loading ? 'Creating...' : 'Create User'}
      </Button>
    </FormContainer>
  );
};

export default UserForm;
