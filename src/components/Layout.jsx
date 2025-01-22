import { useState } from 'react';
import Sidebar from './Sidebar';
import PlaylistTracks from './PlaylistTracks';

const Layout = () => {
  const spotifyToken = localStorage.getItem('spotifyToken');
  const [content, setContent] = useState('home');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistDetails, setPlaylistDetails] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(280); // Ancho inicial de la Sidebar

  // Función para manejar el redimensionamiento
  const handleResize = (e) => {
    const newWidth = e.clientX; // Obtiene la posición del cursor en X
    if (newWidth >= 240 && newWidth <= 450) { // Define los límites de ancho
      setSidebarWidth(newWidth);
    }
  };

  // Detiene el evento de redimensionamiento
  const stopResize = () => {
    window.removeEventListener('mousemove', handleResize);
    window.removeEventListener('mouseup', stopResize);
  };

  // Inicia el evento de redimensionamiento
  const startResize = () => {
    window.addEventListener('mousemove', handleResize);
    window.addEventListener('mouseup', stopResize);
  };

  // Función para renderizar el contenido
  const renderContent = () => {
    switch (content) {
      case 'playlist':
        return (
          <PlaylistTracks
            playlistTracks={playlistTracks}
            playlistDetails={playlistDetails}
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
      {/* Sidebar redimensionable */}
      <div
        className="bg-gray-800 text-white"
        style={{ width: `${sidebarWidth}px`, minWidth: '200px', maxWidth: '400px' }}
      >
        <Sidebar
          spotifyToken={spotifyToken}
          setContent={setContent}
          setPlaylistTracks={setPlaylistTracks}
          setPlaylistDetails={setPlaylistDetails}
        />
      </div>

      {/* Divisor para redimensionar */}
      <div
        className="w-1 bg-gray-600 cursor-col-resize"
        onMouseDown={startResize}
      ></div>

      {/* Contenido principal */}
      <div className="flex-1 bg-gray-900 text-white overflow-y-auto overflow-y-scroll custom-scrollbar">
        {renderContent()}
      </div>
    </div>
  );
};

export default Layout;