import React from "react";
import { loginUrl } from "../utils/auth";

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white mb-6">Spotify Clone</h1>
        <a href={loginUrl}>
          <button className="px-6 py-3 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-400">
            Iniciar sesión con Spotify
          </button>
        </a>
      </div>
    </div>
  );
};

export default Login;