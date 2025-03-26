const express = require('express');
const router = express.Router();
const { auth, employerOnly } = require('../middleware/auth');
const {
  createApplication,
  getUserApplications,
  getJobApplications,
  getEmployerApplications,
  updateApplicationStatus
} = require('../controllers/applicationController');

// Debug endpoint to test route matching
router.get('/test', (req, res) => {
  res.json({ message: 'Applications route is working' });
});

// Direct application submission route with no parameters
router.post('/apply', auth, (req, res) => {
  console.log('Direct apply route hit!', req.body);
  if (!req.body.jobId || !req.body.cover_letter) {
    return res.status(400).json({ error: 'Missing required fields: jobId and cover_letter are required' });
  }
  
  // Modify the request to match what the controller expects
  req.params.jobId = req.body.jobId;
  createApplication(req, res);
});

// Job seeker routes - Adding multiple route patterns to ensure one works
router.post('/job/:jobId', auth, createApplication); // Standard version
router.post('/jobs/:jobId', auth, createApplication); // Alternative version with 'jobs'

router.get('/user/applications', auth, getUserApplications);

// Employer routes
router.get('/employer', auth, employerOnly, getEmployerApplications);
router.get('/job/:jobId', auth, employerOnly, getJobApplications);
router.get('/jobs/:jobId', auth, employerOnly, getJobApplications); // Alternative version with 'jobs'
router.put('/:id/status', auth, employerOnly, updateApplicationStatus);

module.exports = router;
