const pool = require('../config/db');

const getAllJobs = async (req, res) => {
  try {
    const { search, location, type } = req.query;
    let query = `
      SELECT j.*, u.username as employer_name,
             DATE_FORMAT(j.created_at, '%Y-%m-%d %H:%i:%s') as formatted_date
      FROM jobs j
      JOIN users u ON j.employer_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search) {
      query += ` AND (j.title LIKE ? OR j.company LIKE ? OR j.description LIKE ?)`;
      const searchTerm = `%${search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    if (location) {
      query += ` AND j.location LIKE ?`;
      params.push(`%${location}%`);
    }

    if (type && type !== 'all') {
      query += ` AND j.type = ?`;
      params.push(type);
    }

    query += ` ORDER BY j.created_at DESC`;

    const [jobs] = await pool.query(query, params);
    
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching jobs', details: err.message });
  }
};

const getJobById = async (req, res) => {
  try {
    const [jobs] = await pool.query(
      `SELECT j.*, u.username as employer_name,
              DATE_FORMAT(j.created_at, '%Y-%m-%d %H:%i:%s') as formatted_date
       FROM jobs j
       JOIN users u ON j.employer_id = u.id
       WHERE j.id = ?`,
      [req.params.id]
    );

    if (jobs.length === 0) {
      return res.status(404).json({ error: 'Job not found' });
    }

    res.json(jobs[0]);
  } catch (err) {
    console.error('Error in getJobById:', err);
    res.status(500).json({ error: 'Error fetching job', details: err.message });
  }
};

const createJob = async (req, res) => {
  try {
    const { title, company, location, type, description, requirements, salary } = req.body;
    const employer_id = req.user.id;

    console.log('Creating new job:', { 
      title, company, location, type,
      description: description?.substring(0, 50) + '...',
      employer_id 
    });

    if (!title || !company || !location || !type || !description || !requirements || !salary) {
      throw new Error('All fields are required');
    }

    const [result] = await pool.query(
      `INSERT INTO jobs (employer_id, title, company, location, type, description, requirements, salary, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [employer_id, title, company, location, type, description, requirements, salary]
    );

    console.log('Job inserted with ID:', result.insertId);

    const [newJob] = await pool.query(
      `SELECT j.*, u.username as employer_name,
              DATE_FORMAT(j.created_at, '%Y-%m-%d %H:%i:%s') as formatted_date
       FROM jobs j
       JOIN users u ON j.employer_id = u.id
       WHERE j.id = ?`,
      [result.insertId]
    );

    if (newJob.length === 0) {
      throw new Error('Job created but not found in subsequent query');
    }

    console.log('Job created successfully:', newJob[0]);
    res.status(201).json(newJob[0]);
  } catch (err) {
    console.error('Error in createJob:', err);
    res.status(500).json({ error: 'Error creating job', details: err.message });
  }
};

const updateJob = async (req, res) => {
  try {
    const { title, company, location, type, description, requirements, salary } = req.body;
    const jobId = req.params.id;
    const employer_id = req.user.id;

    console.log('Updating job:', { 
      title, company, location, type,
      description: description?.substring(0, 50) + '...',
      employer_id 
    });

    if (!title || !company || !location || !type || !description || !requirements || !salary) {
      throw new Error('All fields are required');
    }

    // Verify ownership
    const [jobs] = await pool.query(
      'SELECT * FROM jobs WHERE id = ? AND employer_id = ?',
      [jobId, employer_id]
    );

    if (jobs.length === 0) {
      return res.status(404).json({ error: 'Job not found or unauthorized' });
    }

    await pool.query(
      `UPDATE jobs 
       SET title = ?, company = ?, location = ?, type = ?, 
           description = ?, requirements = ?, salary = ?
       WHERE id = ? AND employer_id = ?`,
      [title, company, location, type, description, requirements, salary, jobId, employer_id]
    );

    const [updatedJob] = await pool.query(
      `SELECT j.*, u.username as employer_name,
              DATE_FORMAT(j.created_at, '%Y-%m-%d %H:%i:%s') as formatted_date
       FROM jobs j
       JOIN users u ON j.employer_id = u.id
       WHERE j.id = ?`,
      [jobId]
    );

    console.log('Job updated successfully:', updatedJob[0]);
    res.json(updatedJob[0]);
  } catch (err) {
    console.error('Error in updateJob:', err);
    res.status(500).json({ error: 'Error updating job', details: err.message });
  }
};

const deleteJob = async (req, res) => {
  try {
    const jobId = req.params.id;
    const employer_id = req.user.id;

    console.log('Deleting job with ID:', jobId);

    // Verify ownership
    const [jobs] = await pool.query(
      'SELECT * FROM jobs WHERE id = ? AND employer_id = ?',
      [jobId, employer_id]
    );

    if (jobs.length === 0) {
      return res.status(404).json({ error: 'Job not found or unauthorized' });
    }

    await pool.query(
      'DELETE FROM jobs WHERE id = ? AND employer_id = ?',
      [jobId, employer_id]
    );

    console.log('Job deleted successfully');
    res.json({ message: 'Job deleted successfully' });
  } catch (err) {
    console.error('Error in deleteJob:', err);
    res.status(500).json({ error: 'Error deleting job', details: err.message });
  }
};

const getEmployerJobs = async (req, res) => {
  try {
    const employer_id = req.user.id;
    const [jobs] = await pool.query(
      `SELECT j.*, u.username as employer_name,
              DATE_FORMAT(j.created_at, '%Y-%m-%d %H:%i:%s') as formatted_date
       FROM jobs j
       JOIN users u ON j.employer_id = u.id
       WHERE j.employer_id = ?
       ORDER BY j.created_at DESC`,
      [employer_id]
    );
    console.log('Found jobs for employer:', jobs.length);
    
    if (jobs.length === 0) {
      console.log('No jobs found for employer');
    } else {
      console.log('Sample job:', jobs[0]);
    }
    
    res.json(jobs);
  } catch (err) {
    console.error('Error in getEmployerJobs:', err);
    res.status(500).json({ error: 'Error fetching employer jobs', details: err.message });
  }
};

module.exports = {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getEmployerJobs
};
