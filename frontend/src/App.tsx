import "./App.css";
import { Routes, Route } from "react-router-dom";
import Problems from "./pages/problems";
import Solutions from "./pages/solutions";
import Home from "./pages/home";
import NotFoundPage from "./pages/NotFound/notFound";
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/problems" element={<Problems />} />
        <Route path="/solutions" element ={<Solutions />} />
        //404 Not found 
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;
