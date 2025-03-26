import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Grid,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import JobCard from '../components/JobCard';
import api from '../utils/axios';

const Profile = () => {
  const { user } = useAuth();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!user) return;
    
    if (user.role === 'job_seeker') {
      fetchApplications();
    } else if (user.role === 'employer') {
      fetchEmployerJobs();
    }
  }, [user]);

  // Redirect if not logged in
  if (!user) {
    return <Navigate to="/login" />;
  }

  const fetchApplications = async () => {
    try {
      const response = await api.get('/api/applications/user/applications');
      setApplications(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch applications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployerJobs = async () => {
    try {
      const response = await api.get('/api/jobs/employer/listings');
      setJobs(response.data);
      setError('');
    } catch (err) {
      setError('Failed to fetch job listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleJobDelete = (jobId) => {
    setJobs(jobs.filter(job => job.id !== jobId));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

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
          My Profile
        </Typography>
        <Typography variant="h6" color="text.secondary">
          {user.username} • {user.email}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {user.role === 'employer' ? (
        // Employer View
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              My Job Listings
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : jobs.length > 0 ? (
            <Grid container spacing={3}>
              {jobs.map(job => (
                <Grid item xs={12} key={job.id}>
                  <JobCard 
                    job={job}
                    onDelete={handleJobDelete}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                You haven't posted any jobs yet.
              </Typography>
            </Paper>
          )}
        </>
      ) : (
        // Job Seeker View
        <>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>
              My Applications
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : applications.length > 0 ? (
            <Grid container spacing={3}>
              {applications.map(application => (
                <Grid item xs={12} key={application.id}>
                  <Paper 
                    sx={{ 
                      p: 3,
                      transition: 'transform 0.2s, box-shadow 0.2s',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
                      }
                    }}
                  >
                    <Grid container spacing={2}>
                      <Grid item xs={12} md={8}>
                        <Typography variant="h6" gutterBottom>
                          {application.job_title}
                        </Typography>
                        <Typography variant="body1" color="text.secondary" gutterBottom>
                          {application.company_name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                        <Typography variant="body2" color="text.secondary">
                          Applied on: {formatDate(application.created_at)}
                        </Typography>
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: 
                              application.status === 'pending' ? 'warning.main' :
                              application.status === 'accepted' ? 'success.main' :
                              application.status === 'rejected' ? 'error.main' :
                              'text.secondary',
                            fontWeight: 600,
                            mt: 1
                          }}
                        >
                          Status: {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                        </Typography>
                      </Grid>
                    </Grid>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          ) : (
            <Paper sx={{ p: 4, textAlign: 'center' }}>
              <Typography variant="body1" color="text.secondary">
                You haven't applied to any jobs yet.
              </Typography>
            </Paper>
          )}
        </>
      )}
    </Container>
  );
};

export default Profile;
