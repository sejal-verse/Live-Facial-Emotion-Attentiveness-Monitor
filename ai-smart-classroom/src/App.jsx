import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";

import Navbar from "./components/layout/Navbar";

import Home from "./pages/Home/home";
import Contact from "./pages/Contact";
import Login from "./pages/login/login";
import Register from "./pages/register/register";
import Student from "./pages/student/student";

function Layout() {
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/student";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/student" element={<Student />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Layout />
    </BrowserRouter>
  );
}

export default App;