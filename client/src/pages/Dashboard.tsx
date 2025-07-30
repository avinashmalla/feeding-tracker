import React, { useEffect, useState } from 'react';
import { Container, Typography, Avatar, Box, Button } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { fetchUser, setCredentials } from '../features/auth/authSlice';
import axios from 'axios';
import CreateHouseholdDialog from '../components/CreateHouseholdDialog';

const Dashboard: React.FC = () => {
  const user = useSelector((state: RootState) => state.auth.user);
  const token = useSelector((state: RootState) => state.auth.token);
  const dispatch = useDispatch<AppDispatch>();
  const [households, setHouseholds] = useState<any[]>([]);
  const [showDialog, setShowDialog] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken && !token) {
      dispatch(setCredentials({ token: storedToken }));
      dispatch(fetchUser(storedToken));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (!token) return;
    axios
      .get('/api/households', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setHouseholds(res.data);
        if (res.data.length === 0) setShowDialog(true);
      })
      .catch(() => setHouseholds([]));
  }, [token]);

  const handleHouseholdCreated = () => {
    // Refetch households after creation
    if (!token) return;
    axios
      .get('/api/households', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setHouseholds(res.data);
        setShowDialog(res.data.length === 0);
      });
  };

  return (
    <Container maxWidth="md" sx={{ mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      {user && (
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar src={user.photo} alt={user.name} sx={{ mr: 2 }} />
          <Typography variant="h6">Welcome, {user.name}!</Typography>
        </Box>
      )}
      <Typography>
        {households.length === 0
          ? "Please create a household to get started."
          : "Select a pet or add a new one to get started."}
      </Typography>
      <Button
        variant="contained"
        color="primary"
        href="/pets"
        sx={{ mt: 3 }}
        disabled={households.length === 0}
      >
        Go to Pet Management
      </Button>
      <CreateHouseholdDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onCreated={handleHouseholdCreated}
      />
    </Container>
  );
};

export default Dashboard;