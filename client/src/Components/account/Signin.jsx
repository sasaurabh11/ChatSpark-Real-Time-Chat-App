import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useContext } from "react";
import { AccountContext } from "../../ContextApi/AccountProvide";
import { addUser, signupLocal, loginLocal } from "../../Service/api";
import { NavLink } from "react-router-dom";
import defaultProfile from "../../assets/defaultprofile.jpg";

function AuthForm() {
  const { setAccount, setLocalAccount, localAccount } =
    useContext(AccountContext);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [previewImage, setPreviewImage] = useState(null);

  const onLoginSuccess = async (response) => {
    const decodedmassage = jwtDecode(response.credential);
    setAccount(decodedmassage);
  };

  const onLoginError = (error) => {
    console.error("Google login failed:", error);
  };

  const handleEmailChange = (event) => setEmail(event.target.value);
  const handlePasswordChange = (event) => setPassword(event.target.value);
  const handleNameChange = (event) => setName(event.target.value);

  const handleProfilePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfilePhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (isLogin) {
      const data = { email, password };
      const responseloginLocal = await loginLocal(data);
      setLocalAccount(responseloginLocal.user);
    } else {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);

      let photoToUpload = profilePhoto;

      if (!photoToUpload) {
        const response = await fetch(defaultProfile);
        const blob = await response.blob();
        photoToUpload = new File([blob], "defaultprofile.jpg", {
          type: blob.type,
        });
      }

      formData.append("profilePhoto", photoToUpload);

      const responseLocal = await signupLocal(formData);
      setLocalAccount(responseLocal.user);
    }
  };

  return (
    <div className="p-8 text-gray-100">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-white mb-2">
          {isLogin ? "Welcome back!" : "Create your account"}
        </h2>
        <p className="text-gray-400">
          {isLogin ? "Sign in to continue" : "Join us today"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {!isLogin && (
          <div className="space-y-2">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-300"
            >
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={handleNameChange}
              required
              className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Your Beautiful Name"
            />
          </div>
        )}

        <div className="space-y-2">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-300"
          >
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={handleEmailChange}
            required
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="your@email.com"
          />
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-300"
          >
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
            required
            className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
            placeholder="••••••••"
          />
        </div>

        {!isLogin && (
          <div className="space-y-2">
            <label
              htmlFor="dp"
              className="block text-sm font-medium text-gray-300"
            >
              Profile Photo
            </label>
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-full bg-gray-700 border border-gray-600 overflow-hidden flex items-center justify-center">
                {previewImage ? (
                  <img
                    src={previewImage}
                    alt="Preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                )}
              </div>
              <label className="cursor-pointer">
                <span className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition">
                  Choose Image
                </span>
                <input
                  type="file"
                  id="dp"
                  accept="image/*"
                  onChange={handleProfilePhotoChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-200 cursor-pointer"
        >
          {isLogin ? "Sign In" : "Create Account"}
        </button>
      </form>

      {/* <div className="flex justify-center">
        <GoogleLogin
          onSuccess={onLoginSuccess}
          onError={onLoginError}
          theme="filled_black"
          size="large"
          text={isLogin ? 'signin_with' : 'signup_with'}
        />
      </div> */}

      <div className="mt-6 text-center text-sm text-gray-400">
        {isLogin ? "Don't have an account?" : "Already have an account?"}
        <button
          onClick={() => setIsLogin(!isLogin)}
          className="ml-2 text-indigo-400 hover:text-indigo-300 font-medium transition cursor-pointer"
        >
          {isLogin ? "Sign up here" : "Login here"}
        </button>
      </div>
    </div>
  );
}

export default AuthForm;
