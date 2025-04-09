import React, { createContext, useReducer } from 'react';
import axios from 'axios';
import jobReducer from './reducers/jobReducer';

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
    } catch (err) {
      dispatch({
        type: 'JOB_ERROR',
        payload: err.response.data.msg,
      });
    }
  };

  // Get Job
  const getJob = async (id) => {
    try {
      const res = await axios.get(`/api/jobs/${id}`);

      dispatch({
        type: 'GET_JOB',
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: 'JOB_ERROR',
        payload: err.response.data.msg,
      });
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
      const res = await axios.post('/api/jobs', job, config);

      dispatch({
        type: 'ADD_JOB',
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: 'JOB_ERROR',
        payload: err.response.data.msg,
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
      const res = await axios.put(`/api/jobs/${job._id}`, job, config);

      dispatch({
        type: 'UPDATE_JOB',
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: 'JOB_ERROR',
        payload: err.response.data.msg,
      });
    }
  };

  // Delete Job
  const deleteJob = async (id) => {
    try {
      await axios.delete(`/api/jobs/${id}`);

      dispatch({
        type: 'DELETE_JOB',
        payload: id,
      });
    } catch (err) {
      dispatch({
        type: 'JOB_ERROR',
        payload: err.response.data.msg,
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