import React, { useEffect, useState } from "react";
import { FaHome, FaSearch, FaBook } from "react-icons/fa";
import { BsPlusSquare } from "react-icons/bs";
import { getPlaylists } from "../services/spotifyApi";
import { getPlaylistTracks } from '../services/spotifyApi';

const Sidebar = ({ spotifyToken, setContent, setPlaylistTracks }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (spotifyToken) {
      // Llama a la API de Spotify para obtener las playlists
      getPlaylists(spotifyToken).then((data) => {
        setPlaylists(data);
      });
    }
  }, [spotifyToken]);

  const handlePlaylistClick = (playlistId) => {
    // Obtener las canciones de la playlist seleccionada
    getPlaylistTracks(playlistId, spotifyToken)
      .then((tracks) => {
        // Actualizar el estado de las canciones de la playlist en el Layout
        setPlaylistTracks(tracks);
        setContent('playlist'); // Cambiar el contenido dinámico a "playlist"
      })
      .catch((error) => console.error('Error fetching playlist tracks:', error));
  };
  return (
    <div className="h-screen w-64 bg-black text-gray-400 flex flex-col">
    <div className="p-4 text-white text-xl font-bold border-b border-gray-800">
      Spotify Clone
    </div>
    <nav className="flex-1 p-4 space-y-4">
      <a
        href="#"
        onClick={() => setContent('home')}
        className="flex items-center space-x-4 text-white hover:text-green-500"
      >
        Inicio
      </a>
      <a
        href="#"
        onClick={() => setContent('search')}
        className="flex items-center space-x-4 hover:text-green-500"
      >
        Buscar
      </a>
      <a
        href="#"
        onClick={() => setContent('library')}
        className="flex items-center space-x-4 hover:text-green-500"
      >
        Tu Biblioteca
      </a>
    </nav>

    <div className="p-4 space-y-4">
      <button className="flex items-center space-x-4 text-white hover:text-green-500">
        Crear Playlist
      </button>
      <div className="border-t border-gray-800 pt-4">
        <p className="text-gray-500 uppercase text-xs mb-2">Tus Playlists</p>
        <ul className="space-y-2 text-sm">
          {playlists.map((playlist) => (
            <li
              key={playlist.id}
              className="hover:text-green-500 cursor-pointer"
              onClick={() => handlePlaylistClick(playlist.id)} // Maneja el clic en la playlist
            >
              {playlist.name}
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
  );
};

export default Sidebar;