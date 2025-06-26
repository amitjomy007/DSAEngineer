import "./App.css";
import Cookies from "js-cookie";
import { Routes, Route } from "react-router-dom";
//pages
import Login from "./pages/Auth/login";
import Register from "./pages/Auth/register";
// temporary pages which has to be replaced
import Problems from "./pages/problems";
import Solutions from "./pages/solutions";
import Home from "./pages/home";
import NotFoundPage from "./pages/NotFound/notFound";
import AdminPage from "./pages/Admin/admin";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ProblemSolver from "./pages/SolveProblem/solve";
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
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/solve" element={<ProblemSolver />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/solutions" element={<Solutions />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        //404 Not found
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
