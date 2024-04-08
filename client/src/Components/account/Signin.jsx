import React, { useState } from 'react';
import './Signin.css';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

import { useContext } from 'react';
import { AccountContext } from '../../ContextApi/AccountProvide';

import { addUser } from '../../Service/api'

function AuthForm() {

  //use context used here 

  const {setAccount} = useContext(AccountContext)

  const onLoginSuccess = async (response) => {
    // console.log('Google login successful:', response);
    const decodedmassage = jwtDecode(response.credential)
    // console.log(decodedmassage)
    
    setAccount(decodedmassage)
    await addUser(decodedmassage)
  };

  const onLoginError = (error) => {
    console.error('Google login failed:', error);
    // Handle error occurred during Google login
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLogin) {
      console.log('Logging in with:', { email, password });

    } else {
      console.log('Signing up with:', { email, password });
      // const data = {email, password};
      // await  signupLocal(data);
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email:</label>

          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
          />

        </div>

        <div className="form-group">
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
          />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Sign Up'}</button>
      </form>

      <p className='dontaccount'>
        <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
        <button className="toggle-btn" onClick={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Sign Up here' : 'Login here'}
        </button>
      </p>

      <div>
        <GoogleLogin
            onSuccess={onLoginSuccess}
            onError={onLoginError}
        />
      </div>
    </div>
  );
}

export default AuthForm;
