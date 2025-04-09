import React, { createContext, useReducer } from 'react';
import axios from 'axios';
import jobReducer from './reducers/jobReducer';
import { mockJobs, mockStats } from '../utils/mockData';

// Flag to use mock data when API is unavailable
const USE_MOCK_DATA = true; // Set to false when your backend is ready

// Initial state
const initialState = {
  jobs: [],
  job: null,
  loading: true,
  error: null,
  filtered: null,
  stats: {
    applied: 0,
    interview: 0,
    offer: 0,
    rejected: 0,
    saved: 0,
  },
};

// Create context
export const JobContext = createContext(initialState);

// Provider component
export const JobProvider = ({ children }) => {
  const [state, dispatch] = useReducer(jobReducer, initialState);

  // Get Jobs
  const getJobs = async () => {
    try {
      if (USE_MOCK_DATA) {
        // Use mock data
        const stats = mockStats;
        
        setTimeout(() => {
          dispatch({
            type: 'GET_JOBS',
            payload: mockJobs,
            stats,
          });
        }, 500); // Simulate network delay
      } else {
        const res = await axios.get('/api/jobs');

        // Calculate stats
        const stats = {
          applied: 0,
          interview: 0,
          offer: 0,
          rejected: 0,
          saved: 0,
        };

        res.data.forEach((job) => {
          stats[job.status.toLowerCase()]++;
        });

        dispatch({
          type: 'GET_JOBS',
          payload: res.data,
          stats,
        });
      }
    } catch (err) {
      console.error('Error fetching jobs:', err);
      
      // Fallback to mock data on error
      dispatch({
        type: 'GET_JOBS',
        payload: mockJobs,
        stats: mockStats,
      });
    }
  };

  // Get Job
  const getJob = async (id) => {
    try {
      if (USE_MOCK_DATA) {
        // Use mock data
        const job = mockJobs.find(job => job._id === id);
        
        setTimeout(() => {
          dispatch({
            type: 'GET_JOB',
            payload: job,
          });
        }, 500); // Simulate network delay
      } else {
        const res = await axios.get(`/api/jobs/${id}`);

        dispatch({
          type: 'GET_JOB',
          payload: res.data,
        });
      }
    } catch (err) {
      console.error('Error fetching job:', err);
      
      // Fallback to mock data on error
      const job = mockJobs.find(job => job._id === id);
      
      if (job) {
        dispatch({
          type: 'GET_JOB',
          payload: job,
        });
      } else {
        dispatch({
          type: 'JOB_ERROR',
          payload: 'Job not found',
        });
      }
    }
  };

  // Add Job
  const addJob = async (job) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      if (USE_MOCK_DATA) {
        // Create a mock job with ID
        const newJob = {
          ...job,
          _id: String(mockJobs.length + 1),
          applicationDate: new Date(job.applicationDate),
        };
        
        setTimeout(() => {
          dispatch({
            type: 'ADD_JOB',
            payload: newJob,
          });
        }, 500);
      } else {
        const res = await axios.post('/api/jobs', job, config);

        dispatch({
          type: 'ADD_JOB',
          payload: res.data,
        });
      }
    } catch (err) {
      console.error('Error adding job:', err);
      
      dispatch({
        type: 'JOB_ERROR',
        payload: err.response?.data?.msg || 'Error adding job',
      });
    }
  };

  // Update Job
  const updateJob = async (job) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      if (USE_MOCK_DATA) {
        // Update mock job
        const updatedJob = {
          ...job,
          applicationDate: new Date(job.applicationDate),
        };
        
        setTimeout(() => {
          dispatch({
            type: 'UPDATE_JOB',
            payload: updatedJob,
          });
        }, 500);
      } else {
        const res = await axios.put(`/api/jobs/${job._id}`, job, config);

        dispatch({
          type: 'UPDATE_JOB',
          payload: res.data,
        });
      }
    } catch (err) {
      console.error('Error updating job:', err);
      
      dispatch({
        type: 'JOB_ERROR',
        payload: err.response?.data?.msg || 'Error updating job',
      });
    }
  };

  // Delete Job
  const deleteJob = async (id) => {
    try {
      if (USE_MOCK_DATA) {
        // Delete from mock data
        setTimeout(() => {
          dispatch({
            type: 'DELETE_JOB',
            payload: id,
          });
        }, 500);
      } else {
        await axios.delete(`/api/jobs/${id}`);

        dispatch({
          type: 'DELETE_JOB',
          payload: id,
        });
      }
    } catch (err) {
      console.error('Error deleting job:', err);
      
      dispatch({
        type: 'JOB_ERROR',
        payload: err.response?.data?.msg || 'Error deleting job',
      });
    }
  };

  // Filter Jobs
  const filterJobs = (text) => {
    dispatch({ type: 'FILTER_JOBS', payload: text });
  };

  // Clear Filter
  const clearFilter = () => {
    dispatch({ type: 'CLEAR_FILTER' });
  };

  // Clear Jobs
  const clearJobs = () => {
    dispatch({ type: 'CLEAR_JOBS' });
  };

  return (
    <JobContext.Provider
      value={{
        jobs: state.jobs,
        job: state.job,
        loading: state.loading,
        error: state.error,
        filtered: state.filtered,
        stats: state.stats,
        getJobs,
        getJob,
        addJob,
        updateJob,
        deleteJob,
        filterJobs,
        clearFilter,
        clearJobs,
      }}
    >
      {children}
    </JobContext.Provider>
  );
}; 