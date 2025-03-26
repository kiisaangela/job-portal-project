import React from 'react';
import { Navigate } from 'react-router-dom';
import { Container, Typography, Box, useTheme } from '@mui/material';
import { useAuth } from '../context/AuthContext';
import JobForm from '../components/JobForm';

const PostJob = () => {
  const { user } = useAuth();
  const theme = useTheme();

  // Redirect if not logged in or not an employer
  if (!user || user.role !== 'employer') {
    return <Navigate to="/login" />;
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom
          sx={{
            fontWeight: 600,
            background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          Post a New Job
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Fill in the details below to create a new job listing
        </Typography>
      </Box>

      <JobForm />
    </Container>
  );
};

export default PostJob;
