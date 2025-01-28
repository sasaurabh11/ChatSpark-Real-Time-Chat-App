import React, { useState } from 'react';
import './Signin.css';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

import { useContext } from 'react';
import { AccountContext } from '../../ContextApi/AccountProvide';

import { addUser, signupLocal, loginLocal } from '../../Service/api'
import { NavLink } from 'react-router-dom';

// import {photo} from "../../assets/defaultprofile.jpg"

function AuthForm() {
  const {setAccount, setLocalAccount, localAccount} = useContext(AccountContext)

  const onLoginSuccess = async (response) => {
    const decodedmassage = jwtDecode(response.credential)
    
    setAccount(decodedmassage)
  };

  const onLoginError = (error) => {
    console.error('Google login failed:', error);
    // Handle error occurred during Google login
  };

  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isLogin, setIsLogin] = useState(true);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleProfilePhotoChange = (event) => {
    setProfilePhoto(event.target.files[0]);
  };

  const DEFAULT_PROFILE_PHOTO_URL = '../../assets/defaultprofile.jpg';

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLogin) {
      const data = {email, password};

      const responseloginLocal = await loginLocal(data)
      setLocalAccount(responseloginLocal.user)


    } else {
      
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }else {
        formData.append('profilePhoto', DEFAULT_PROFILE_PHOTO_URL);
      }
      
      const responseLocal = await signupLocal(formData);
      setLocalAccount(responseLocal.user)
    }
  };

  return (
    <div className="auth-container">
      <h2>{isLogin ? 'Login' : 'Sign Up'}</h2>

      <form onSubmit={handleSubmit}>
         {!isLogin && (
            <div className="form-group">
              <label htmlFor="name">Name:</label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                required
              />
            </div>
          )}

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

        {!isLogin && (
          <div className="form-group">
            <label htmlFor="dp">Profile Photo:</label>
            <input
              type="file"
              id="dp"
              accept=".jpg"
              onChange={handleProfilePhotoChange}
            />
          </div>
        )}


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
