import React, { useState } from 'react';
import "./Login.css"
import { useAuth } from '../../contexts/AuthContext';
import { usePorts } from '../../contexts/PortContext';
import { useMessage } from '../Common/MessageContext';
// import { json } from 'stream/consumers';
// import logo from "../../../public/logo.png";

const Login: React.FC = () => {

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{ username?: string, password?: string, noport?: string }>({});
  const { login } = useAuth();
  const { ports } = usePorts();
  const { error, success } = useMessage();

  const validateEmail = (email: string): boolean => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePassword = (password: string): boolean => {
    // Example: Password must be at least 6 characters long and contain at least one number
    const re = /^(?=.*\d).{6,}$/;
    return re.test(password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let validationErrors: { username?: string, password?: string, noport?: string } = {};

    if (!validateEmail(username)) {
      validationErrors.username = 'Invalid email format';
    }

    if (!validatePassword(password)) {
      validationErrors.password = 'Password must be at least 6 characters long and contain at least one number';
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      // Clear errors
      setErrors({});
      // Add authentication logic here
        await login(username, password);
        if(ports.length===0 && error===''){
          validationErrors.noport = "No port assigned to him."
          setErrors(validationErrors);
        }else {
          setErrors({});
        }
    }
  };


  return (
    <div className='login-container'>
      <img src='../../../logo.png' alt="imagelogo" className='logo-img' />
      <div className='login-form'>
        <h1>Login</h1>
        {errors.noport && <div style={{ color: 'red' }}>{errors.noport}</div>}
        <form onSubmit={handleSubmit}>
          <div>
            <label>Email: </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            {errors.username && <div style={{ color: 'red' }}>{errors.username}</div>}
          </div>
          <div>
            <label>Password: </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {errors.password && <div style={{ color: 'red' }}>{errors.password}</div>}
            {error && (
              <div style={{ color: 'red' }}>
                <p>Error: {error}</p>
              </div>
            )}
            {success && (
              <div style={{ color: 'green' }}>
                <p>Success: {success}</p>
              </div>
            )}

          </div>
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
