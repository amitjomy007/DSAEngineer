import "./App.css";
import Cookies from "js-cookie";
import { Routes, Route } from "react-router-dom";
//pages
import Login from "./pages/Auth/login";
import Register from "./pages/Auth/register";
import AddProblemPage from "./pages/ProblemRelated/addProblem";
import Hero from "./pages/Hero";
import ProblemsPage from "./pages/ProblemRelated/problems";
import SubmissionResult from "./pages/ProblemRelated/verdictPage";

// temporary pages which has to be replaced

import NotFoundPage from "./pages/NotFound/notFound";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import SolveProblemPage from "./pages/ProblemRelated/solveProblem";
function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const userEmail = Cookies.get("email31d6cfe0d16ae931b73c59d7e0c089c0");
    const token = Cookies.get("token31d6cfe0d16ae931b73c59d7e0c089c0");
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
        <Route path="/" element={<ProblemsPage />} />
        <Route path="/Hero" element={<Hero />} />
        <Route path="/problems" element={<ProblemsPage />} />
        <Route path="/problems/:slug" element={<SolveProblemPage />} />
        <Route
          path="/problems/:slug/submission"
          element={<SubmissionResult />}
        />
        <Route
          path="/problems/:slug/submission/:submissionId"
          element={<SubmissionResult />}
        />
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
