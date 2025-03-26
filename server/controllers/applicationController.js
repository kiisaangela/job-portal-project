const pool = require('../config/db');

const createApplication = async (req, res) => {
  try {
    console.log('Application submission received:', {
      body: req.body,
      params: req.params,
      userId: req.user?.id
    });
    
    const { cover_letter } = req.body;
    const job_id = req.params.jobId;
    const applicant_id = req.user.id;

    // Check if job exists
    const [jobs] = await pool.query('SELECT * FROM jobs WHERE id = ?', [job_id]);
    if (jobs.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    // Check if user has already applied
    const [existingApplications] = await pool.query(
      'SELECT * FROM applications WHERE job_id = ? AND applicant_id = ?',
      [job_id, applicant_id]
    );

    if (existingApplications.length > 0) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }

    // Create application
    const [result] = await pool.query(
      'INSERT INTO applications (job_id, applicant_id, cover_letter) VALUES (?, ?, ?)',
      [job_id, applicant_id, cover_letter]
    );

    // Enhanced logging after successful insertion
    console.log(`Application created successfully. ID: ${result.insertId}, Job ID: ${job_id}, Applicant ID: ${applicant_id}`);

    const [application] = await pool.query(
      `SELECT a.*, j.title as job_title, j.company, u.username as applicant_name
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN users u ON a.applicant_id = u.id
       WHERE a.id = ?`,
      [result.insertId]
    );

    res.status(201).json(application[0]);
  } catch (err) {
    console.error('Error in createApplication:', err);
    res.status(500).json({ error: 'Error creating application' });
  }
};

const getUserApplications = async (req, res) => {
  try {
    const [applications] = await pool.query(
      `SELECT a.*, j.title as job_title, j.company, u.username as applicant_name
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN users u ON a.applicant_id = u.id
       WHERE a.applicant_id = ?
       ORDER BY a.created_at DESC`,
      [req.user.id]
    );
    res.json(applications);
  } catch (err) {
    console.error('Error in getUserApplications:', err);
    res.status(500).json({ error: 'Error fetching applications' });
  }
};

const getJobApplications = async (req, res) => {
  try {
    const job_id = req.params.jobId;

    // Verify job ownership
    const [jobs] = await pool.query(
      'SELECT * FROM jobs WHERE id = ? AND employer_id = ?',
      [job_id, req.user.id]
    );

    if (jobs.length === 0) {
      return res.status(404).json({ error: 'Job not found or unauthorized' });
    }

    const [applications] = await pool.query(
      `SELECT a.*, j.title as job_title, j.company, u.username as applicant_name
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN users u ON a.applicant_id = u.id
       WHERE a.job_id = ?
       ORDER BY a.created_at DESC`,
      [job_id]
    );
    res.json(applications);
  } catch (err) {
    console.error('Error in getJobApplications:', err);
    res.status(500).json({ error: 'Error fetching applications' });
  }
};

const getEmployerApplications = async (req, res) => {
  try {
    const employer_id = req.user.id;

    // Get all applications for all jobs posted by the employer
    const [applications] = await pool.query(
      `SELECT a.*, j.title as job_title, j.company, u.username as applicant_name, u.email as applicant_email
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN users u ON a.applicant_id = u.id
       WHERE j.employer_id = ?
       ORDER BY a.created_at DESC`,
      [employer_id]
    );
    
    res.json(applications);
  } catch (err) {
    console.error('Error in getEmployerApplications:', err);
    res.status(500).json({ error: 'Error fetching applications' });
  }
};

const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const application_id = req.params.id;

    // Verify employer owns the job
    const [applications] = await pool.query(
      `SELECT a.*, j.employer_id 
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       WHERE a.id = ?`,
      [application_id]
    );

    if (applications.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }

    if (applications[0].employer_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await pool.query(
      'UPDATE applications SET status = ? WHERE id = ?',
      [status, application_id]
    );

    const [updatedApplication] = await pool.query(
      `SELECT a.*, j.title as job_title, j.company, u.username as applicant_name
       FROM applications a
       JOIN jobs j ON a.job_id = j.id
       JOIN users u ON a.applicant_id = u.id
       WHERE a.id = ?`,
      [application_id]
    );

    res.json(updatedApplication[0]);
  } catch (err) {
    console.error('Error in updateApplicationStatus:', err);
    res.status(500).json({ error: 'Error updating application status' });
  }
};

module.exports = {
  createApplication,
  getUserApplications,
  getJobApplications,
  getEmployerApplications,
  updateApplicationStatus
};
