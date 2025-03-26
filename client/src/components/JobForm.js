import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import {
  Box,
  TextField,
  Button,
  Typography,
  MenuItem,
  Paper,
  Alert,
  InputAdornment
} from '@mui/material';

const JobForm = ({ job, onSubmit }) => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    title: job?.title || '',
    company: job?.company || '',
    location: job?.location || '',
    type: job?.type || 'full-time',
    description: job?.description || '',
    requirements: job?.requirements || '',
    salary: job?.salary || ''
  });

  const jobTypes = ['full-time', 'part-time', 'contract', 'remote'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      console.log('Starting job submission...');
      console.log('Form data:', formData);
      console.log('Current user token:', localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')).token : 'No token');
      
      let endpoint = job ? `/api/jobs/${job.id}` : '/api/jobs';
      console.log(`Using endpoint: ${endpoint}`);
      console.log(`Full URL will be: ${api.defaults.baseURL}${endpoint}`);
      
      let response;
      if (job) {
        // Update existing job
        response = await api.put(endpoint, formData);
      } else {
        // Create new job
        response = await api.post(endpoint, formData);
      }

      console.log('Job API Response:', response.data);
      
      if (onSubmit) {
        onSubmit(response.data);
      }
      navigate('/jobs');
    } catch (err) {
      console.error('Error posting job:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url,
        method: err.config?.method,
        headers: err.config?.headers,
        data: err.config?.data
      });
      
      setError(err.response?.data?.error || 'Failed to submit job. Please try again.');
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 4, maxWidth: 800, mx: 'auto' }}>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Box component="form" onSubmit={handleSubmit}>
        <Typography variant="h6" gutterBottom>
          Job Details
        </Typography>

        <TextField
          fullWidth
          label="Job Title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          margin="normal"
          placeholder="e.g., Senior Software Engineer"
        />

        <TextField
          fullWidth
          label="Company"
          name="company"
          value={formData.company}
          onChange={handleChange}
          required
          margin="normal"
          placeholder="e.g., Tech Corp Inc."
        />

        <TextField
          fullWidth
          label="Location"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
          margin="normal"
          placeholder="e.g., San Francisco, CA or Remote"
        />

        <TextField
          fullWidth
          select
          label="Job Type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          margin="normal"
        >
          {jobTypes.map(type => (
            <MenuItem key={type} value={type}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          fullWidth
          label="Annual Salary"
          name="salary"
          type="number"
          value={formData.salary}
          onChange={handleChange}
          margin="normal"
          InputProps={{
            startAdornment: <InputAdornment position="start">$</InputAdornment>,
          }}
          placeholder="e.g., 120000"
        />

        <TextField
          fullWidth
          label="Job Description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          required
          multiline
          rows={6}
          margin="normal"
          placeholder="Describe the role, responsibilities, and what a typical day looks like..."
        />

        <TextField
          fullWidth
          label="Requirements"
          name="requirements"
          value={formData.requirements}
          onChange={handleChange}
          required
          multiline
          rows={4}
          margin="normal"
          placeholder="List the required skills, experience, and qualifications..."
        />

        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            size="large"
          >
            {job ? 'Update Job' : 'Post Job'}
          </Button>
          <Button
            variant="outlined"
            color="primary"
            size="large"
            onClick={() => navigate(-1)}
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

export default JobForm;
