import "./App.css";
import Cookies from "js-cookie";
import { Routes, Route } from "react-router-dom";
//pages
import Login from "./pages/Auth/login";
import Register from "./pages/Auth/register";
import AddProblemPage from "./pages/ProblemRelated/addProblem";
// temporary pages which has to be replaced

import Home from "./pages/home";
import NotFoundPage from "./pages/NotFound/notFound";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const userEmail = Cookies.get("email");
    const token = Cookies.get("token");
    let isAuthenticated = false;
    if (token) {
      isAuthenticated = true;
      const data = {
        isAuthenticated: isAuthenticated,
        user: userEmail,
        token: token,
      };

      dispatch({ type: "auth/login", payload: data });
    }
  }, [dispatch]);
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/addProblem" element={<AddProblemPage />} />
        //404 Not found
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
