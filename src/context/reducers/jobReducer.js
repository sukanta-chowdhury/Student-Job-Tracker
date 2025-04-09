const jobReducer = (state, action) => {
  switch (action.type) {
    case 'GET_JOBS':
      return {
        ...state,
        jobs: action.payload,
        stats: action.stats,
        loading: false,
      };
    case 'GET_JOB':
      return {
        ...state,
        job: action.payload,
        loading: false,
      };
    case 'ADD_JOB':
      return {
        ...state,
        jobs: [action.payload, ...state.jobs],
        loading: false,
      };
    case 'UPDATE_JOB':
      return {
        ...state,
        jobs: state.jobs.map((job) =>
          job._id === action.payload._id ? action.payload : job
        ),
        loading: false,
      };
    case 'DELETE_JOB':
      return {
        ...state,
        jobs: state.jobs.filter((job) => job._id !== action.payload),
        loading: false,
      };
    case 'CLEAR_JOBS':
      return {
        ...state,
        jobs: [],
        job: null,
        filtered: null,
        error: null,
        loading: false,
      };
    case 'FILTER_JOBS':
      return {
        ...state,
        filtered: state.jobs.filter((job) => {
          const regex = new RegExp(`${action.payload}`, 'gi');
          return (
            job.company.match(regex) ||
            job.position.match(regex) ||
            job.location.match(regex) ||
            job.status.match(regex) ||
            (job.notes && job.notes.match(regex))
          );
        }),
      };
    case 'CLEAR_FILTER':
      return {
        ...state,
        filtered: null,
      };
    case 'JOB_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false,
      };
    default:
      return state;
  }
};

export default jobReducer; 