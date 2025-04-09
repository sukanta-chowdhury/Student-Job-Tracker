import React, { createContext, useReducer, useEffect } from 'react';
import axios from 'axios';
import authReducer from './reducers/authReducer';
import setAuthToken from '../utils/setAuthToken';
import { mockUser } from '../utils/mockData';

// Flag to use mock data when API is unavailable
const USE_MOCK_DATA = true; // Set to false when your backend is ready

// Initial state
const initialState = {
  token: localStorage.getItem('token'),
  isAuthenticated: USE_MOCK_DATA || null,
  loading: !USE_MOCK_DATA,
  user: USE_MOCK_DATA ? mockUser : null,
  error: null,
};

// Create context
export const AuthContext = createContext(initialState);

// Provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Load User
  const loadUser = async () => {
    if (USE_MOCK_DATA) {
      // Use mock data - already loaded in initialState
      return;
    }

    if (localStorage.token) {
      setAuthToken(localStorage.token);
    }

    try {
      const res = await axios.get('/api/auth');

      dispatch({
        type: 'USER_LOADED',
        payload: res.data,
      });
    } catch (err) {
      dispatch({
        type: 'AUTH_ERROR',
      });
    }
  };

  // Register User
  const register = async (formData) => {
    if (USE_MOCK_DATA) {
      // Simulate successful registration
      setTimeout(() => {
        const mockToken = 'mock-token-12345';
        localStorage.setItem('token', mockToken);
        
        dispatch({
          type: 'REGISTER_SUCCESS',
          payload: { token: mockToken },
        });
        
        // Now load the user
        dispatch({
          type: 'USER_LOADED',
          payload: mockUser,
        });
      }, 500);
      
      return;
    }
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const res = await axios.post('/api/users', formData, config);

      dispatch({
        type: 'REGISTER_SUCCESS',
        payload: res.data,
      });

      loadUser();
    } catch (err) {
      console.error('Registration error:', err);
      
      const errors = err.response?.data?.errors;

      if (errors) {
        errors.forEach((error) => console.error(error.msg));
      }

      dispatch({
        type: 'REGISTER_FAIL',
        payload: err.response?.data?.msg || 'Registration failed',
      });
    }
  };

  // Login User
  const login = async (formData) => {
    if (USE_MOCK_DATA) {
      // Simulate successful login
      if (formData.email === 'test@example.com' && formData.password === 'password') {
        setTimeout(() => {
          const mockToken = 'mock-token-12345';
          localStorage.setItem('token', mockToken);
          
          dispatch({
            type: 'LOGIN_SUCCESS',
            payload: { token: mockToken },
          });
          
          // Now load the user
          dispatch({
            type: 'USER_LOADED',
            payload: mockUser,
          });
        }, 500);
      } else {
        setTimeout(() => {
          dispatch({
            type: 'LOGIN_FAIL',
            payload: 'Invalid credentials',
          });
        }, 500);
      }
      
      return;
    }
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const res = await axios.post('/api/auth', formData, config);

      dispatch({
        type: 'LOGIN_SUCCESS',
        payload: res.data,
      });

      loadUser();
    } catch (err) {
      console.error('Login error:', err);
      
      dispatch({
        type: 'LOGIN_FAIL',
        payload: err.response?.data?.msg || 'Invalid credentials',
      });
    }
  };

  // Logout
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };

  // Clear Errors
  const clearErrors = () => dispatch({ type: 'CLEAR_ERRORS' });

  useEffect(() => {
    if (!USE_MOCK_DATA) {
      loadUser();
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        token: state.token,
        isAuthenticated: state.isAuthenticated,
        loading: state.loading,
        user: state.user,
        error: state.error,
        register,
        login,
        logout,
        loadUser,
        clearErrors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}; 