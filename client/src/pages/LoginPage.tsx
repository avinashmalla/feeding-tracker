import React from 'react';
import { Button, Container, Typography } from '@mui/material';

const LoginPage: React.FC = () => {
  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:5000/api/auth/google';
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 8, textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Pet Feeding Tracker
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={handleGoogleLogin}
        sx={{ mt: 4 }}
      >
        Sign in with Google
      </Button>
    </Container>
  );
};

export default LoginPage;