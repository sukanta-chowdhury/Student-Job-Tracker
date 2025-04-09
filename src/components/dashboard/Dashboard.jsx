import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { JobContext } from '../../context/JobContext';
import { AuthContext } from '../../context/AuthContext';
import JobItem from '../jobs/JobItem';

const Dashboard = () => {
  const jobContext = useContext(JobContext);
  const authContext = useContext(AuthContext);

  const { jobs, getJobs, loading, filtered, filterJobs, clearFilter, stats } = jobContext;
  const { user } = authContext;

  const [filter, setFilter] = useState('');

  useEffect(() => {
    getJobs();
    // eslint-disable-next-line
  }, []);

  const onChange = (e) => {
    setFilter(e.target.value);
    
    if (e.target.value !== '') {
      filterJobs(e.target.value);
    } else {
      clearFilter();
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className='dashboard'>
      <h1>Dashboard</h1>
      {user && <h2>Welcome {user.name}</h2>}
      
      <div className='dashboard-stats'>
        <div className='stat-card'>
          <h3>{stats.applied}</h3>
          <p>Applied</p>
        </div>
        <div className='stat-card'>
          <h3>{stats.interview}</h3>
          <p>Interviews</p>
        </div>
        <div className='stat-card'>
          <h3>{stats.offer}</h3>
          <p>Offers</p>
        </div>
        <div className='stat-card'>
          <h3>{stats.rejected}</h3>
          <p>Rejected</p>
        </div>
      </div>
      
      <div className='dashboard-filter'>
        <input
          type='text'
          placeholder='Filter Jobs...'
          onChange={onChange}
          value={filter}
        />
        <Link to='/jobs/new' className='btn btn-primary'>
          <i className='fas fa-plus'></i> Add Job
        </Link>
      </div>
      
      <div className='job-list'>
        {filtered !== null
          ? filtered.map((job) => <JobItem key={job._id} job={job} />)
          : jobs.map((job) => <JobItem key={job._id} job={job} />)}
      </div>
    </div>
  );
};

export default Dashboard; 