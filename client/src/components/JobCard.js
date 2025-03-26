import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Chip,
  IconButton,
  Menu,
  MenuItem,
  useTheme
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkIcon from '@mui/icons-material/Work';
import BusinessIcon from '@mui/icons-material/Business';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import api from '../utils/axios';

const JobCard = ({ job }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = () => {
    navigate(`/jobs/${job.id}`);
  };

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async (event) => {
    event.stopPropagation();
    handleMenuClose();
    try {
      await api.delete(`/api/jobs/${job.id}`);
      window.location.reload();
    } catch (error) {
      console.error('Error deleting job:', error);
    }
  };

  const isEmployer = user?.role === 'employer';
  const isOwner = isEmployer && user?.id === job.employer_id;

  return (
    <Card
      onClick={handleClick}
      elevation={2}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s, box-shadow 0.2s',
        borderRadius: 2,
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: theme.shadows[4],
        },
      }}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box>
            <Typography
              variant="h5"
              component="h2"
              gutterBottom
              sx={{
                fontWeight: 600,
                color: theme.palette.primary.main,
                mb: 1
              }}
            >
              {job.title}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                <BusinessIcon sx={{ mr: 0.5 }} />
                <Typography variant="subtitle1">{job.company}</Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', color: 'text.secondary' }}>
                <LocationOnIcon sx={{ mr: 0.5 }} />
                <Typography variant="subtitle1">{job.location}</Typography>
              </Box>
            </Box>
          </Box>
          {isOwner && (
            <>
              <IconButton onClick={handleMenuClick}>
                <MoreVertIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                onClick={(e) => e.stopPropagation()}
              >
                <MenuItem onClick={handleDelete}>Delete</MenuItem>
              </Menu>
            </>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
          <Chip
            icon={<WorkIcon />}
            label={job.type}
            size="small"
            sx={{
              background: `${theme.palette.primary.main}22`,
              color: theme.palette.primary.main,
              fontWeight: 500
            }}
          />
          <Chip
            icon={<AttachMoneyIcon />}
            label={`$${job.salary.toLocaleString()}`}
            size="small"
            sx={{
              background: `${theme.palette.secondary.main}22`,
              color: theme.palette.secondary.main,
              fontWeight: 500
            }}
          />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            mb: 2
          }}
        >
          {job.description}
        </Typography>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" color="text.secondary">
            Posted by {job.employer_name} • {new Date(job.created_at).toLocaleDateString()}
          </Typography>
          <Button
            variant="contained"
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/jobs/${job.id}`);
            }}
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              color: 'white',
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`
              }
            }}
          >
            View Details
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default JobCard;
