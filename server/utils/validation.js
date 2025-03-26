const validateEmail = (email) => {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(String(email).toLowerCase());
};

const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d\w\W]{8,}$/;
  return re.test(password);
};

const validateJobInput = (job) => {
  const errors = [];

  if (!job.title || job.title.trim().length < 3) {
    errors.push('Job title must be at least 3 characters long');
  }

  if (!job.company || job.company.trim().length < 2) {
    errors.push('Company name must be at least 2 characters long');
  }

  if (!job.location || job.location.trim().length < 2) {
    errors.push('Location must be at least 2 characters long');
  }

  if (!['full-time', 'part-time', 'contract', 'remote'].includes(job.type)) {
    errors.push('Invalid job type');
  }

  if (!job.description || job.description.trim().length < 50) {
    errors.push('Job description must be at least 50 characters long');
  }

  if (job.salary && (isNaN(job.salary) || job.salary < 0)) {
    errors.push('Salary must be a positive number');
  }

  return errors;
};

const validateApplication = (application) => {
  const errors = [];

  if (!application.coverLetter || application.coverLetter.trim().length < 100) {
    errors.push('Cover letter must be at least 100 characters long');
  }

  return errors;
};

const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove any HTML tags and encode special characters
  return input
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};

module.exports = {
  validateEmail,
  validatePassword,
  validateJobInput,
  validateApplication,
  sanitizeInput
};
