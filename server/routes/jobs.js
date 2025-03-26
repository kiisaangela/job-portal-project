const express = require('express');
const router = express.Router();
const { auth, employerOnly } = require('../middleware/auth');
const {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs
} = require('../controllers/jobController');

// Public routes
router.get('/', getAllJobs);

// Protected employer-only routes
router.post('/', auth, employerOnly, createJob);
router.get('/employer/listings', auth, employerOnly, getEmployerJobs);

// Routes with parameters
router.get('/:id', getJobById);
router.put('/:id', auth, employerOnly, updateJob);
router.delete('/:id', auth, employerOnly, deleteJob);

module.exports = router;
