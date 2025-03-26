import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to add the auth token
api.interceptors.request.use(
  (config) => {
    try {
      // Get user from localStorage and add token to headers
      const userStr = localStorage.getItem('user');
      console.log('User data from localStorage:', userStr ? 'Found' : 'Not found');
      
      if (userStr) {
        const user = JSON.parse(userStr);
        console.log('User parsed:', user ? `User ID: ${user.id}, Role: ${user.role}` : 'Failed to parse');
        
        if (user && user.token) {
          console.log('Adding token to request headers');
          config.headers.Authorization = `Bearer ${user.token}`;
        } else {
          console.log('No token found in user data');
        }
      }
      
      console.log('Request config:', {
        url: config.url,
        method: config.method,
        baseURL: config.baseURL,
        headers: config.headers,
      });
      
      return config;
    } catch (error) {
      console.error('Error in request interceptor:', error);
      return config;
    }
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add a response interceptor for better error handling
api.interceptors.response.use(
  (response) => {
    // Log successful responses
    console.log(`Response from ${response.config.url}:`, {
      status: response.status,
      statusText: response.statusText,
      data: response.data,
    });
    return response;
  },
  (error) => {
    // Enhanced error logging
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        url: error.config.url,
        method: error.config.method,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', {
        request: 'No response received',
        url: error.config.url,
        method: error.config.method,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message);
    }
    
    return Promise.reject(error);
  }
);

export default api;
