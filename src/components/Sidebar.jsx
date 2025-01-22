import React, { useEffect, useState } from "react";
import { FaHome, FaSearch, FaBook } from "react-icons/fa";
import { BsPlusSquare } from "react-icons/bs";
import { getPlaylists } from "../services/spotifyApi";
import { getPlaylistTracks } from '../services/spotifyApi';
import { getPlaylistDetails } from "../services/spotifyApi";
const Sidebar = ({ spotifyToken, setContent, setPlaylistTracks, setPlaylistDetails }) => {
  const [playlists, setPlaylists] = useState([]);

  useEffect(() => {
    if (spotifyToken) {
      getPlaylists(spotifyToken).then((data) => {
        console.log("Playlists data:", data);
        setPlaylists(data);
      });
    }
  }, [spotifyToken]);

  const handlePlaylistClick = async (playlistId) => {
    try {
      console.log('Fetching playlist details for:', playlistId); // <-- Log antes de la petición
      const [tracks, details] = await Promise.all([
        getPlaylistTracks(playlistId, spotifyToken),
        getPlaylistDetails(playlistId, spotifyToken),
      ]);
      console.log('Fetched details:', details); // <-- Log después de la petición
  
      setPlaylistTracks(tracks);
      setPlaylistDetails(details); // Actualiza los detalles de la playlist
      setContent('playlist');
    } catch (error) {
      console.error('Error fetching playlist data:', error);
    }
  };

  return (
    <div className="h-screen bg-black text-gray-400 flex flex-col overflow-y-auto overflow-y-scroll custom-scrollbar">
      <div className="p-4 text-white text-xl font-bold border-b border-gray-800">
        Spotify Clone
      </div>
      <nav className="flex-1 p-4 space-y-4">
        <a
          href="#"
          onClick={() => setContent("home")}
          className="flex items-center space-x-4 text-white hover:text-green-500"
        >
          Inicio
        </a>
      </nav>
      <div className="p-2 space-y-4">
        <div className="border-t border-gray-800 pt-4">
          <p className="text-gray-500 uppercase text-xs mb-2">Tus Playlists</p>
          {playlists && playlists.length > 0 ? (
            <ul className="space-y-1 text-sm">
              {playlists.map((playlist) => (
                <li
                  key={playlist.id}
                  className="flex items-center space-x-3 hover:bg-[#343434] p-1 rounded-lg cursor-pointer"
                  onClick={() => handlePlaylistClick(playlist.id)}
                >
                  {/* Imagen de la playlist */}
                  {playlist.images?.[0]?.url ? (
                    <img
                      src={playlist.images[0].url}
                      alt={playlist.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-lg bg-gray-700 flex items-center justify-center text-xs text-gray-400">
                      No Image
                    </div>
                  )}
                  {/* Información de la playlist */}
                  <div>
                    <p className="text-white font-semibold truncate text-base">{playlist.name}</p>
                    <p className="text-gray-400 text-sm font-semibold">
                      {playlist.type} · {playlist.owner.display_name}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500 text-sm">No se encontraron playlists.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;