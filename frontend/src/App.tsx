import "./App.css";
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
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<AdminPage />} />
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
