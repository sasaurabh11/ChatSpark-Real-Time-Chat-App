import React, { useState } from 'react';
import './Signin.css';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";

import { useContext } from 'react';
import { AccountContext } from '../../ContextApi/AccountProvide';

import { addUser, signupLocal } from '../../Service/api'

function AuthForm() {

  //use context used here 

  const {setAccount, setLocalAccount, localAccount} = useContext(AccountContext)

  const onLoginSuccess = async (response) => {
    // console.log('Google login successful:', response);
    const decodedmassage = jwtDecode(response.credential)
    console.log(decodedmassage)
    
    setAccount(decodedmassage)
    await addUser(decodedmassage)
  };

  const onLoginError = (error) => {
    console.error('Google login failed:', error);
    // Handle error occurred during Google login
  };

  const [name, setName] = useState('')
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isLogin, setIsLogin] = useState(false); // here I have to change in true

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
    // setProfilePhoto(event.target.files[0]);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        setProfilePhoto(reader.result); // Store base64 string in state
      };
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLogin) {
      console.log('Logging in with:', { email, password });

    } else {
      console.log('Signing up with:', {name,  email, password, profilePhoto });
      // const data = {name, email, password, profilePhoto};
      
      const formData = new FormData();
      formData.append('name', name);
      formData.append('email', email);
      formData.append('password', password);
      // formData.append('profilePhoto', profilePhoto);
      if (profilePhoto) {
        formData.append('profilePhoto', profilePhoto);
      }
      
      setLocalAccount(formData)  //I have to manage here data for useContext
      await  signupLocal(formData);
      // console.log('Signing up with:', localAccount.name);
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
