import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const apiUrl = import.meta.env.VITE_API_URL;

export const login = createAsyncThunk('auth/login', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/login`, { email, password }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return { token: response.data.token, email };
  } catch (err) {
    console.error('Login error:', err.response?.data?.error || err.message);
    return rejectWithValue(err.response?.data?.error || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async ({ email, password }, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${apiUrl}/api/auth/register`, { email, password }, {
      headers: { 'Content-Type': 'application/json' },
    });
    return { token: response.data.token, email };
  } catch (err) {
    console.error('Register error:', err.response?.data?.error || err.message);
    return rejectWithValue(err.response?.data?.error || 'Registration failed');
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: true,
    error: null,
  },
  reducers: {
    logout: (state) => {
      console.log('Logging out user');
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem('auth');
    },
    initializeAuth: (state, action) => {
      state.user = action.payload;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        localStorage.setItem('auth', JSON.stringify(action.payload));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        localStorage.setItem('auth', JSON.stringify(action.payload));
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;