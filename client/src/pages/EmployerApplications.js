import React, { useState, useEffect } from 'react';
import { Navigate, useParams } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Tabs,
  Tab,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  useTheme
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import DescriptionIcon from '@mui/icons-material/Description';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { useAuth } from '../context/AuthContext';
import api from '../utils/axios';

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`applications-tabpanel-${index}`}
      aria-labelledby={`applications-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const EmployerApplications = () => {
  const { id } = useParams(); // Job ID if viewing applications for a specific job
  const { user } = useAuth();
  const theme = useTheme();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await api.get('/api/jobs/employer/listings');
        setJobs(response.data);
      } catch (err) {
        console.error('Error fetching employer jobs:', err);
      }
    };

    if (user?.role === 'employer') {
      fetchJobs();
    }
  }, [user]);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError('');
      try {
        let response;
        if (id) {
          // Fetch applications for specific job
          response = await api.get(`/api/applications/job/${id}`);
        } else {
          // Fetch all applications for employer's jobs
          response = await api.get('/api/applications/employer');
        }
        setApplications(response.data);
      } catch (err) {
        console.error('Error fetching applications:', err);
        setError(err.response?.data?.error || 'Failed to fetch applications');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'employer') {
      fetchApplications();
    }
  }, [id, user]);

  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleUpdateStatus = async (applicationId, newStatus) => {
    try {
      await api.put(`/api/applications/${applicationId}/status`, {
        status: newStatus
      });
      
      // Update the application status in the UI
      setApplications(prevApplications =>
        prevApplications.map(app =>
          app.id === applicationId ? { ...app, status: newStatus } : app
        )
      );
    } catch (err) {
      console.error('Error updating application status:', err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'default';
      case 'reviewing':
        return 'primary';
      case 'interview':
        return 'info';
      case 'accepted':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (!user || user.role !== 'employer') {
    return <Navigate to="/login" />;
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Get unique status values to create tabs
  const statuses = ['all', 'pending', 'reviewing', 'interview', 'accepted', 'rejected'];

  // Filter applications based on selected tab
  const filteredApplications = tabValue === 0
    ? applications
    : applications.filter(app => app.status === statuses[tabValue]);

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
          {id ? 'Job Applications' : 'Manage Applications'}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {id ? 'View and manage applications for this position' : 'View and manage applications for all your job listings'}
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {applications.length === 0 ? (
        <Paper 
          elevation={0}
          sx={{ 
            p: 4, 
            borderRadius: '12px',
            textAlign: 'center',
            background: 'rgba(255, 255, 255, 0.7)',
            backdropFilter: 'blur(5px)',
            border: '1px solid rgba(0, 0, 0, 0.1)'
          }}
        >
          <Typography variant="h6" color="text.secondary" gutterBottom>
            No applications found
          </Typography>
          <Typography variant="body2" color="text.secondary">
            You currently don't have any applications to review.
          </Typography>
        </Paper>
      ) : (
        <>
          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: '12px',
              background: 'rgba(255, 255, 255, 0.8)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)'
            }}
          >
            <Tabs
              value={tabValue}
              onChange={handleChangeTab}
              variant="scrollable"
              scrollButtons="auto"
              sx={{
                '& .MuiTabs-indicator': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                }
              }}
            >
              {statuses.map((status, index) => (
                <Tab 
                  key={status} 
                  label={status.charAt(0).toUpperCase() + status.slice(1)} 
                  id={`applications-tab-${index}`}
                  aria-controls={`applications-tabpanel-${index}`}
                />
              ))}
            </Tabs>

            {statuses.map((status, index) => (
              <TabPanel key={status} value={tabValue} index={index}>
                <Grid container spacing={3}>
                  {filteredApplications.map((application) => (
                    <Grid item xs={12} key={application.id}>
                      <Card 
                        elevation={2}
                        sx={{ 
                          borderRadius: '12px',
                          overflow: 'hidden',
                          transition: 'transform 0.2s ease-in-out',
                          '&:hover': {
                            transform: 'translateY(-4px)'
                          }
                        }}
                      >
                        <CardContent>
                          <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="h6" gutterBottom>
                                  {application.job_title}
                                </Typography>
                                <Chip 
                                  size="small" 
                                  label={application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                                  color={getStatusColor(application.status)}
                                  sx={{ mr: 1 }}
                                />
                              </Box>

                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <PersonIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2">
                                  {application.applicant_name}
                                </Typography>
                              </Box>

                              {application.applicant_email && (
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                  <EmailIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                  <Typography variant="body2">
                                    {application.applicant_email}
                                  </Typography>
                                </Box>
                              )}

                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <DateRangeIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2">
                                  Applied on {formatDate(application.created_at)}
                                </Typography>
                              </Box>
                            </Grid>
                            
                            <Grid item xs={12} md={8}>
                              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                                <DescriptionIcon fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                                <Typography variant="body2" fontWeight="500">
                                  Cover Letter
                                </Typography>
                              </Box>
                              <Box 
                                sx={{ 
                                  p: 2, 
                                  maxHeight: '200px', 
                                  overflow: 'auto',
                                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                                  borderRadius: '8px',
                                  whiteSpace: 'pre-line'
                                }}
                              >
                                <Typography variant="body2">
                                  {application.cover_letter}
                                </Typography>
                              </Box>
                            </Grid>
                          </Grid>
                        </CardContent>
                        
                        <Divider />
                        
                        <CardActions sx={{ p: 2, justifyContent: 'flex-end', gap: 1 }}>
                          {application.status === 'pending' && (
                            <Button 
                              variant="outlined" 
                              size="small"
                              onClick={() => handleUpdateStatus(application.id, 'reviewing')}
                            >
                              Mark as Reviewing
                            </Button>
                          )}
                          
                          {application.status === 'reviewing' && (
                            <Button 
                              variant="outlined" 
                              size="small"
                              onClick={() => handleUpdateStatus(application.id, 'interview')}
                              color="primary"
                            >
                              Schedule Interview
                            </Button>
                          )}
                          
                          {application.status !== 'accepted' && application.status !== 'rejected' && (
                            <>
                              <Button 
                                variant="contained" 
                                size="small"
                                onClick={() => handleUpdateStatus(application.id, 'accepted')}
                                color="success"
                              >
                                Accept
                              </Button>
                              
                              <Button 
                                variant="contained" 
                                size="small"
                                onClick={() => handleUpdateStatus(application.id, 'rejected')}
                                color="error"
                              >
                                Reject
                              </Button>
                            </>
                          )}
                        </CardActions>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </TabPanel>
            ))}
          </Paper>
        </>
      )}
    </Container>
  );
};

export default EmployerApplications;
