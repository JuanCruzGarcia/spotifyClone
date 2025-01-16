import React from "react";
import Layout from "./Layout";

const Home = () => {
  return (
    <Layout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">Bienvenido a Spotify Clone</h1>
        <p>Selecciona una playlist o explora tu música favorita.</p>
      </div>
    </Layout>
  );
};

export default Home;