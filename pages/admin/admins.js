import { useEffect, useState } from 'react';
import Layout from '../../componentsadmin/Layout';
import styled from 'styled-components';

const Container = styled.div`
  max-width: 32rem;
  margin: 3rem auto;
  background-color: white;
  padding: 2rem;
  border-radius: 12px;
`;

const Title = styled.h1`
  font-size: 1.875rem;
  font-weight: 600;
  color: #1f2937;
  margin-bottom: 1.5rem;
`;

const InputContainer = styled.div`
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  
`;

const Input = styled.input`
  border: 1px solid #d1d5db;
  padding: 12px;
  border-radius: 8px;
  width: 100%;
  outline: none;
  transition: 0.2s ease-in-out;

  &:focus {
    border-color: #4b5563;
    box-shadow: 0 0 0 3px rgba(75, 85, 99, 0.3);
  }
`;

const AddButton = styled.button`
  background-color: #374151;
  color: white;
  padding: 12px 20px;
  border-radius: 8px;
  transition: 0.2s ease-in-out;
  cursor: pointer;
  font-family: "Lora", serif;
  
  &:hover {
    background-color: #1f2937;
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: #dc2626;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const AdminList = styled.ul`
  border-top: 1px solid #e5e7eb;
`;

const AdminItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #e5e7eb;
`;

const AdminEmail = styled.span`
  color: #1f2937;
  font-size: 1.125rem;
  gap: 4;
`;

const RemoveButton = styled.button`
  background-color: #dc2626;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  transition: 0.2s ease-in-out;
  cursor: pointer;
  gap: 4;

  &:hover {
    background-color: #b91c1c;
  }
`;


export default function AdminsPage() {
  const [admins, setAdmins] = useState([]);
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchAdmins();
  }, []);

  async function fetchAdmins() {
    const res = await fetch('/api/admins');
    const data = await res.json();
    setAdmins(data);
  }

  async function addAdmin() {
    if (!email) {
      setError('Email is required');
      return;
    }
    setLoading(true);
    const res = await fetch('/api/admins', {
      method: 'POST',
      body: JSON.stringify({ email }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      fetchAdmins();
      setEmail('');
      setError('');
    } else {
      setError('Failed to add admin');
    }
    setLoading(false);
  }

  async function removeAdmin(adminEmail) {
    setLoading(true);
    await fetch('/api/admins', {
      method: 'DELETE',
      body: JSON.stringify({ email: adminEmail }),
      headers: { 'Content-Type': 'application/json' },
    });
    fetchAdmins();
    setLoading(false);
  }

  
return (
  <Layout>
    <Container>
      <Title>Admin Management</Title>

      {/* Input & Add Button */}
      <InputContainer>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter admin email"
        />
        <AddButton onClick={addAdmin} disabled={loading}>
          {loading ? "Adding..." : "Add Admin"}
        </AddButton>
      </InputContainer>

      {/* Error Message */}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {/* Admin List */}
      <AdminList>
        {admins.map((admin) => (
          <AdminItem key={admin.email}>
            <AdminEmail>{admin.email}</AdminEmail>
            <RemoveButton onClick={() => removeAdmin(admin.email)}>Remove</RemoveButton>
          </AdminItem>
        ))}
      </AdminList>
    </Container>
  </Layout>
);
}