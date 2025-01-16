import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
import { getTokenFromUrl } from "./utils/auth";

const App = () => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    const tokenFromUrl = getTokenFromUrl();
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
      localStorage.setItem("spotifyToken", tokenFromUrl);
      window.location.hash = ""; // Limpia el hash para seguridad
    } else {
      const storedToken = localStorage.getItem("spotifyToken");
      if (storedToken) {
        setToken(storedToken);
      }
    }
  }, []);

  useEffect(() => {
    if (token) {
      const timeout = setTimeout(() => {
        localStorage.removeItem("spotifyToken");
        setToken(null);
        alert("El token ha expirado, por favor inicia sesión nuevamente.");
      }, 3600 * 1000);
      return () => clearTimeout(timeout);
    }
  }, [token]);

  return (
    <Router>
      <Routes>
        {!token ? (
          <Route path="/" element={<Login />} />
        ) : (
          <Route path="/" element={<Home />} />
        )}
      </Routes>
    </Router>
  );
};

export default App;