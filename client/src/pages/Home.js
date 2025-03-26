import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  useTheme,
  useMediaQuery
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import BusinessCenterIcon from '@mui/icons-material/BusinessCenter';
import WorkIcon from '@mui/icons-material/Work';
import GroupIcon from '@mui/icons-material/Group';
import { useAuth } from '../context/AuthContext';
import Footer from '../components/Footer';

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const { user } = useAuth();

  const features = [
    {
      icon: <SearchIcon sx={{ fontSize: 40 }} />,
      title: 'Smart Job Search',
      description: 'Find the perfect job with our intelligent search and filtering system.'
    },
    {
      icon: <BusinessCenterIcon sx={{ fontSize: 40 }} />,
      title: 'Career Growth',
      description: 'Access opportunities that align with your career goals and aspirations.'
    },
    {
      icon: <WorkIcon sx={{ fontSize: 40 }} />,
      title: 'Easy Applications',
      description: 'Apply to multiple jobs with a streamlined application process.'
    },
    {
      icon: <GroupIcon sx={{ fontSize: 40 }} />,
      title: 'Employer Connect',
      description: 'Connect directly with top employers and companies.'
    }
  ];

  return (
    <Box sx={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}22 0%, ${theme.palette.secondary.main}22 100%)`,
          pt: { xs: 8, md: 12 },
          pb: { xs: 10, md: 14 },
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 50% 0%, ${theme.palette.primary.main}11, transparent 50%)`,
            zIndex: 1
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(circle at 90% 90%, ${theme.palette.secondary.main}11, transparent 50%)`,
            zIndex: 1
          }
        }}
      >
        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box sx={{ textAlign: { xs: 'center', md: 'left' } }}>
                <Typography
                  variant="h2"
                  component="h1"
                  gutterBottom
                  sx={{
                    fontWeight: 800,
                    fontSize: { xs: '2.5rem', md: '3.5rem' },
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 2
                  }}
                >
                  Your Gateway to
                  <br />
                  Career Success
                </Typography>
                <Typography
                  variant="h5"
                  color="text.secondary"
                  sx={{
                    mb: 4,
                    fontWeight: 400,
                    lineHeight: 1.5
                  }}
                >
                  Connect with opportunities that matter. Find your next career move with Nexus.
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, justifyContent: { xs: 'center', md: 'flex-start' } }}>
                  <Button
                    variant="contained"
                    size="large"
                    onClick={() => navigate('/jobs')}
                    sx={{
                      py: 1.5,
                      px: 4,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
                      }
                    }}
                  >
                    Find Jobs
                  </Button>
                  {!user && (
                    <Button
                      variant="outlined"
                      size="large"
                      onClick={() => navigate('/register')}
                      sx={{
                        py: 1.5,
                        px: 4
                      }}
                    >
                      Join Now
                    </Button>
                  )}
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box
                sx={{
                  position: 'relative',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: '10%',
                    left: '10%',
                    width: '80%',
                    height: '80%',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}22, ${theme.palette.secondary.main}22)`,
                    borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%',
                    animation: 'morphing 15s ease-in-out infinite',
                    zIndex: -1
                  },
                  '@keyframes morphing': {
                    '0%': {
                      borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
                    },
                    '50%': {
                      borderRadius: '70% 30% 30% 70% / 70% 70% 30% 30%'
                    },
                    '100%': {
                      borderRadius: '30% 70% 70% 30% / 30% 30% 70% 70%'
                    }
                  }
                }}
              >
                <img
                  src="/career.svg"
                  alt="Career Illustration"
                  style={{
                    width: '100%',
                    height: 'auto',
                    maxWidth: '500px',
                    display: 'block',
                    margin: '0 auto'
                  }}
                />
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Typography
          variant="h3"
          align="center"
          gutterBottom
          sx={{
            fontWeight: 700,
            mb: 8
          }}
        >
          Why Choose Nexus?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  height: '100%',
                  textAlign: 'center',
                  borderRadius: 4,
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: `0 0 0 2px ${theme.palette.primary.main}22`
                  }
                }}
              >
                <Box
                  sx={{
                    mb: 2,
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}11, ${theme.palette.secondary.main}11)`,
                    color: theme.palette.primary.main
                  }}
                >
                  {feature.icon}
                </Box>
                <Typography
                  variant="h6"
                  gutterBottom
                  sx={{
                    fontWeight: 600,
                    mb: 2
                  }}
                >
                  {feature.title}
                </Typography>
                <Typography
                  variant="body1"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.6
                  }}
                >
                  {feature.description}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}11, ${theme.palette.secondary.main}11)`,
          py: { xs: 8, md: 12 }
        }}
      >
        <Container maxWidth="md">
          <Box
            sx={{
              textAlign: 'center'
            }}
          >
            <Typography
              variant="h3"
              gutterBottom
              sx={{
                fontWeight: 700,
                mb: 3
              }}
            >
              Ready to Take the Next Step?
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{
                mb: 4,
                fontWeight: 400
              }}
            >
              Join thousands of professionals who've found their dream careers through Nexus.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(user ? '/jobs' : '/register')}
              sx={{
                py: 2,
                px: 6,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
                }
              }}
            >
              {user ? 'Explore Jobs' : 'Get Started'}
            </Button>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Home;
