import React, { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "3000";
console.log("backendUrl:", backendUrl);
const RegistrationPage = () => {
  const [firstname, setFirstname] = useState("tima");
  const [lastname, setLastname] = useState("test");
  const [email, setEmail] = useState("johndoe@random.com");
  const [password, setPassword] = useState("1234");
  const isAuthenticated = Cookies.get("token31d6cfe0d16ae931b73c59d7e0c089c0");
  const Navigate = useNavigate();
  const dispatch = useDispatch();
  useEffect(() => {
    if (isAuthenticated) {
      Navigate("/problems");
    }
  }, [isAuthenticated, Navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // TODO: Implement registration logic
    try {
      setEmail((email) => email.toLowerCase());
      const response = await axios.post(`${backendUrl}/register`, {
        firstname,
        lastname,
        email,
        password,
      });
      dispatch({ type: "auth/login", payload: response.data });
      await Cookies.set(
        "token31d6cfe0d16ae931b73c59d7e0c089c0",
        JSON.stringify(response.data.user.token),
        {
          secure: true,
          expires: 1,
        }
      ); //expires in a day and httpS Cookie
      await Cookies.set(
        "userId31d6cfe0d16ae931b73c59d7e0c089c0",
        JSON.stringify(response.data.user._id),
        {
          secure: true,
          expires: 1,
        }
      );
      await Cookies.set(
        "user31d6cfe0d16ae931b73c59d7e0c089c0",
        JSON.stringify(response.data.user.firstname),
        {
          secure: true,
          expires: 1,
        }
      );
      await Cookies.set(
        "email31d6cfe0d16ae931b73c59d7e0c089c0",
        JSON.stringify(response.data.user.email),
        {
          secure: true,
          expires: 1,
        }
      );
      Navigate("/problems");
      console.log("Response: ", response);
      console.log("Succesful");
    } catch (error) {
      console.log("catched registration error: ", error);
    }
    console.log("Registration form submitted", {
      firstname,
      lastname,
      email,
      password,
    });
  };

  const navigateToLogin = () => {
    // TODO: Implement navigation to login page
    console.log("Navigate to login page");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-black px-4 py-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Create Account
          </h2>
          <p className="text-gray-300 text-lg">
            Join us and start your journey
          </p>
        </div>

        <div className="bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl shadow-2xl border border-gray-700/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="firstname"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  First Name
                </label>
                <input
                  id="firstname"
                  type="text"
                  value={firstname}
                  onChange={(e) => setFirstname(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700/70"
                  placeholder="John"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="lastname"
                  className="block text-sm font-medium text-gray-200 mb-2"
                >
                  Last Name
                </label>
                <input
                  id="lastname"
                  type="text"
                  value={lastname}
                  onChange={(e) => setLastname(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 hover:bg-gray-700/70"
                  placeholder="Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
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
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-200 mb-2"
              >
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

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transform transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              Create Account
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-300 text-sm">
              Already have an account?{" "}
              <button
                onClick={navigateToLogin}
                className="text-blue-400 hover:text-blue-300 font-medium hover:underline transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 rounded px-1"
              >
                Login here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
