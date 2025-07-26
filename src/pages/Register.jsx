import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../redux/authSlice';


const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: reduxError } = useSelector((state) => state.auth);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const result = await dispatch(register({ email, password })).unwrap();
      if (result) {
        navigate('/list');
      }
    } catch (err) {
      setError(err || 'Registration failed. Please try again or contact support.');
    }
  };

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl shadow-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold text-black text-center">Register</h2>
        {(error || reduxError) && <p className="text-red-500 text-center">{error || reduxError}</p>}
        <div className="space-y-4">
          <div>
            <label className="text-black text-sm mb-1 block">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl px-3 py-1.5 bg-white/80 text-black placeholder-black/50 outline-none focus:ring-2 focus:ring-black/20"
              placeholder="Enter email"
              required
            />
          </div>
          <div>
            <label className="text-black text-sm mb-1 block">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl px-3 py-1.5 bg-white/80 text-black placeholder-black/50 outline-none focus:ring-2 focus:ring-black/20"
              placeholder="Enter password"
              required
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 text-white py-1.5 rounded-xl font-semibold hover:opacity-90 transition-all disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
          <p className="text-black text-sm text-center">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-500 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;