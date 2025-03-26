import React from 'react';
import { Box, Container, Grid, Typography, Link, IconButton, Divider, useTheme } from '@mui/material';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TwitterIcon from '@mui/icons-material/Twitter';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import LocationOnIcon from '@mui/icons-material/LocationOn';

const Footer = () => {
  const theme = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        backgroundColor: 'rgba(248, 250, 252, 0.8)',
        backdropFilter: 'blur(10px)',
        borderTop: `1px solid ${theme.palette.divider}`,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 10% 90%, ${theme.palette.primary.main}11, transparent 40%)`,
          zIndex: 0
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at 90% 10%, ${theme.palette.secondary.main}11, transparent 40%)`,
          zIndex: 0
        }
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  mb: 1,
                }}
              >
                Nexus
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 2, fontWeight: 500 }}>
                Your Career Gateway
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Connecting talented professionals with innovative companies. Find your next opportunity with Nexus.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                <IconButton
                  size="small"
                  sx={{
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}22`,
                    },
                  }}
                >
                  <LinkedInIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}22`,
                    },
                  }}
                >
                  <TwitterIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}22`,
                    },
                  }}
                >
                  <FacebookIcon />
                </IconButton>
                <IconButton
                  size="small"
                  sx={{
                    color: theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: `${theme.palette.primary.main}22`,
                    },
                  }}
                >
                  <InstagramIcon />
                </IconButton>
              </Box>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/" underline="hover" color="text.secondary" sx={{ '&:hover': { color: theme.palette.primary.main } }}>
                Home
              </Link>
              <Link href="/jobs" underline="hover" color="text.secondary" sx={{ '&:hover': { color: theme.palette.primary.main } }}>
                Browse Jobs
              </Link>
              <Link href="/login" underline="hover" color="text.secondary" sx={{ '&:hover': { color: theme.palette.primary.main } }}>
                Login
              </Link>
              <Link href="/register" underline="hover" color="text.secondary" sx={{ '&:hover': { color: theme.palette.primary.main } }}>
                Register
              </Link>
              <Link href="/post-job" underline="hover" color="text.secondary" sx={{ '&:hover': { color: theme.palette.primary.main } }}>
                Post a Job
              </Link>
            </Box>
          </Grid>
          
          <Grid item xs={12} sm={6} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <EmailIcon fontSize="small" color="primary" />
                <Typography variant="body2" color="text.secondary">
                  contact@nexusjobs.com
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PhoneIcon fontSize="small" color="primary" />
                <Typography variant="body2" color="text.secondary">
                  +1 (555) 123-4567
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOnIcon fontSize="small" color="primary" />
                <Typography variant="body2" color="text.secondary">
                  123 Career Plaza, San Francisco, CA 94103
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
        
        <Divider sx={{ my: 4 }} />
        
        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, justifyContent: 'space-between', alignItems: 'center', gap: 2 }}>
          <Typography variant="body2" color="text.secondary">
            &copy; {currentYear} Nexus. All rights reserved.
          </Typography>
          <Box sx={{ display: 'flex', gap: 3 }}>
            <Link href="#" underline="hover" color="text.secondary" sx={{ fontSize: '0.875rem', '&:hover': { color: theme.palette.primary.main } }}>
              Privacy Policy
            </Link>
            <Link href="#" underline="hover" color="text.secondary" sx={{ fontSize: '0.875rem', '&:hover': { color: theme.palette.primary.main } }}>
              Terms of Service
            </Link>
            <Link href="#" underline="hover" color="text.secondary" sx={{ fontSize: '0.875rem', '&:hover': { color: theme.palette.primary.main } }}>
              Sitemap
            </Link>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
