import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Paper,
  Alert,
  CircularProgress,
  useTheme
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';

const JobApplication = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const theme = useTheme();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    coverLetter: '',
  });

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

  // Redirect if not logged in or not a job seeker
  if (!user || user.role !== 'job_seeker') {
    return <Navigate to="/login" />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log(`Sending application for job ${id} with cover letter length: ${formData.coverLetter.length}`);
      // Log the full request URL and auth status for debugging
      console.log(`Request URL: /api/applications/apply`);
      console.log('Auth status:', !!user?.token);
      
      // Make sure we have the auth token
      if (!user || !user.token) {
        setError('You must be logged in to apply for jobs');
        return;
      }
      
      // Add the authorization header explicitly for this request
      const config = {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      };
      
      // Ensure we're using the right endpoint format - the problem might be how we're calling it
      const endpoint = `/api/applications/apply`; // Use the new direct route that doesn't rely on URL parameters
      console.log(`Making POST request to: ${endpoint}`);
      
      // Fixed endpoint to match the controller's expected path structure
      const response = await api.post(endpoint, {
        cover_letter: formData.coverLetter,
        jobId: id, // Include the job ID in the request body
      }, config);
      
      console.log('Application submitted successfully:', response.data);
      navigate(`/jobs/${id}?applied=success`);
    } catch (err) {
      console.error('Application submission error:', err);
      // Enhanced error reporting with more details
      if (err.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('Error response:', {
          data: err.response.data,
          status: err.response.status,
          headers: err.response.headers
        });
        setError(`Error (${err.response.status}): ${err.response.data?.error || 'Unknown error'}`);
      } else if (err.request) {
        // The request was made but no response was received
        console.error('No response received:', err.request);
        setError('No response from server. Please check your connection.');
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Request setup error:', err.message);
        setError('Error creating request: ' + err.message);
      }
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!job) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Job not found.</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ p: 4, borderRadius: 2 }}>
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
            Apply for Position
          </Typography>
          <Typography variant="h6" color="text.secondary" gutterBottom>
            {job.title} at {job.company}
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 4 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Cover Letter"
            name="coverLetter"
            value={formData.coverLetter}
            onChange={handleChange}
            required
            multiline
            rows={10}
            placeholder="Write a compelling cover letter explaining why you're the perfect fit for this position..."
            sx={{ mb: 3 }}
          />

          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              type="submit"
              variant="contained"
              size="large"
              sx={{
                px: 4,
                py: 1.5,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
                }
              }}
            >
              Submit Application
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate(`/jobs/${id}`)}
              sx={{ px: 4, py: 1.5 }}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default JobApplication;
