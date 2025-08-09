import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const UserProfile = () => {
  const { user } = useAuth();

  if (!user) {
    return <div>Loading user information...</div>;
  }

  return (
    <div style={{ 
      padding: '20px', 
      border: '1px solid #ddd', 
      borderRadius: '8px',
      backgroundColor: '#f9f9f9'
    }}>
      <h3>User Profile</h3>
      <div style={{ marginBottom: '10px' }}>
        <strong>Name:</strong> {user.firstName} {user.lastName}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>Username:</strong> {user.username}
      </div>
      <div style={{ marginBottom: '10px' }}>
        <strong>Email:</strong> {user.email}
      </div>
    </div>
  );
};

export default UserProfile;
