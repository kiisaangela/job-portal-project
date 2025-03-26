import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Button,
  Paper,
  Grid,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [hasApplied, setHasApplied] = useState(false);

  useEffect(() => {
    const getJob = async () => {
      try {
        const response = await api.get(`/api/jobs/${id}`);
        setJob(response.data);
        setError('');
      } catch (err) {
        setError('Failed to fetch job details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      getJob();
    }
  }, [id]);

  useEffect(() => {
    const checkApplication = async () => {
      try {
        const response = await api.get(`/api/applications/user/applications`);
        const hasAlreadyApplied = response.data.some(app => app.job_id === parseInt(id));
        setHasApplied(hasAlreadyApplied);
      } catch (err) {
        console.error('Error checking application status:', err);
      }
    };

    if (user && user.role === 'job_seeker' && id) {
      checkApplication();
    }
  }, [user, id]);

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(salary);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!job) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Job not found.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
        {/* Header Section */}
        <Box sx={{ mb: 4 }}>
          <Typography 
            variant="h4" 
            component="h1" 
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            {job.title}
          </Typography>

          <Grid container spacing={2} sx={{ mb: 3 }}>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <BusinessIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                <Typography variant="body1" color="text.secondary">
                  {job.company}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                <Typography variant="body1" color="text.secondary">
                  {job.location}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <WorkIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                <Chip 
                  label={job.type.charAt(0).toUpperCase() + job.type.slice(1)} 
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              </Box>
            </Grid>

            {job.salary && (
              <Grid item xs={12} sm={6} md={3}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <AttachMoneyIcon sx={{ mr: 1, color: theme.palette.text.secondary }} />
                  <Typography variant="body1" color="text.secondary">
                    {formatSalary(job.salary)}
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>

          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            {user?.role === 'job_seeker' && (
              <Button
                variant="contained"
                color="primary"
                size="large"
                disabled={hasApplied}
                onClick={() => navigate(`/jobs/${id}/apply`)}
                sx={{
                  px: 4,
                  py: 1.5,
                  background: hasApplied ? undefined : 
                    `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    background: hasApplied ? undefined :
                      `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
                  }
                }}
              >
                {hasApplied ? 'Already Applied' : 'Apply Now'}
              </Button>
            )}

            {user?.role === 'employer' && job.employer_id === user.id && (
              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={() => navigate(`/jobs/${id}/applications`)}
                sx={{
                  px: 4,
                  py: 1.5,
                }}
              >
                View Applications
              </Button>
            )}
          </Box>
        </Box>

        <Divider sx={{ my: 4 }} />

        {/* Description Section */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Job Description
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {job.description}
          </Typography>
        </Box>

        {/* Requirements Section */}
        <Box>
          <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
            Requirements
          </Typography>
          <Typography variant="body1" sx={{ whiteSpace: 'pre-line' }}>
            {job.requirements}
          </Typography>
        </Box>

        {/* Posted By Section */}
        <Box sx={{ mt: 4, pt: 4, borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="body2" color="text.secondary">
            Posted by: {job.employer_name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Posted on: {new Date(job.created_at).toLocaleDateString()}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default JobDetails;
