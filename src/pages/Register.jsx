import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { register } from '../redux/authSlice';
import InputField from '../components/InputField';
import ErrorMessage from '../components/ErrorMessage';
import Button from '../components/Button';
import CardContainer from '../components/CardContainer';
import { useTheme } from '../components/ThemeContext';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error: reduxError } = useSelector((state) => state.auth);
  const { textColor } = useTheme();

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
    <div className="h-screen flex items-center justify-center px-4 bg-gradient-to-l from-indigo-400 to-purple-400">
      <CardContainer className="space-y-4">
        <h2 className={`text-2xl font-bold ${textColor} text-center`}>Register</h2>
        <ErrorMessage error={error || reduxError} />
        <div className="space-y-4">
          <InputField
            label="Email"
            type="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter email"
            required
            textColor={textColor}
          />
          <InputField
            label="Password"
            type="password"
            name="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            textColor={textColor}
          />
          <Button
            onClick={handleSubmit}
            variant="primary"
            disabled={loading}
            className="w-full disabled:opacity-50"
          >
            {loading ? 'Registering...' : 'Register'}
          </Button>
          <p className={`${textColor} text-sm text-center`}>
            Already have an account?{' '}
            <a href="/login" className="text-indigo-800 hover:underline">
              Login
            </a>
          </p>
        </div>
      </CardContainer>
    </div>
  );
};

export default Register;