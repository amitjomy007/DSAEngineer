import React, { useState,useEffect } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
const backendUrl = import.meta.env.VITE_BACKEND_URL || "3000";
console.log("backendUrl:", backendUrl);
const Login = () => {
  const [email, setEmail] = useState('johnDoeExample@example.com');
  const [password, setPassword] = useState('1234');
  const dispatch = useDispatch();
  const Navigate = useNavigate();
  const isAuthenticated = Cookies.get("token31d6cfe0d16ae931b73c59d7e0c089c0");
  useEffect (()=> {
    if(isAuthenticated){
      Navigate("/problems");
    }
  },[isAuthenticated,Navigate]);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    console.log("Going to handle submit");
    e.preventDefault();
    try{
      const response = await axios.post(`${backendUrl}/login`, {email, password});
      dispatch({type:"auth/login", payload:response.data}); //not required
      await Cookies.set("token31d6cfe0d16ae931b73c59d7e0c089c0", JSON.stringify(response.data.user.token), {secure:true, expires: 1}); //expires in a day and httpS Cookie
      await Cookies.set("user31d6cfe0d16ae931b73c59d7e0c089c0", JSON.stringify(response.data.user.firstname), {secure:true, expires: 1});
      await Cookies.set("userId31d6cfe0d16ae931b73c59d7e0c089c0", JSON.stringify(response.data.user._id), {secure:true, expires: 1});
      await Cookies.set("email31d6cfe0d16ae931b73c59d7e0c089c0", JSON.stringify(response.data.user.email), {secure:true, expires: 1});
      Navigate("/problems");
      console.log("Response: ", response);
    }
    catch(error){
      console.log("Catched the Error: ", error);
    }
    // TODO: Implement login logic
    console.log('Login form submitted', { email, password });
  };

  const navigateToRegister = () => {
    // TODO: Implement navigation to register page
    console.log('Navigate to register page');
  };

  const handleForgotPassword = () => {
    // TODO: Implement forgot password logic
    console.log('Handle forgot password');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">Welcome Back</h2>
          <p className="text-gray-300 text-lg">Sign in to your account</p>
        </div>
        
        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700/70"
                placeholder="john.doe@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700/70"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="flex items-center justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm text-blue-400 hover:text-blue-300 hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded px-1"
              >
                Forgot Password?
              </button>
            </div>
            
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              Sign In
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <p className="text-gray-300 text-sm">
              Don't have an account?{' '}
              <button
                onClick={navigateToRegister}
                className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded px-1"
              >
                Register here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;