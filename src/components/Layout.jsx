import { useState } from 'react';
import Sidebar from './Sidebar';
import PlaylistTracks from './PlaylistTracks';

const Layout = ({ children }) => {
  const spotifyToken = localStorage.getItem('spotifyToken');
  const [content, setContent] = useState('home');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistDetails, setPlaylistDetails] = useState(null); // Nuevo estado

  const renderContent = () => {
    switch (content) {
      case 'playlist':
        return (
          <PlaylistTracks
            playlistTracks={playlistTracks}
            playlistDetails={playlistDetails} // Pasa los detalles aquí
          />
        );
      case 'home':
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Bienvenido a Spotify Clone</h1>
            <p>Selecciona una playlist o explora tu música favorita.</p>
          </div>
        );
      default:
        return (
          <div className="p-6">
            <h1 className="text-2xl font-bold">Bienvenido a Spotify Clone</h1>
            <p>Selecciona una opción para comenzar.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar
        spotifyToken={spotifyToken}
        setContent={setContent}
        setPlaylistTracks={setPlaylistTracks}
        setPlaylistDetails={setPlaylistDetails} // Pasa la función al Sidebar
      />
      <div className="flex-1 bg-gray-900 text-white overflow-y-auto">
        {renderContent()}
      </div>
    </div>
  );
};

export default Layout;