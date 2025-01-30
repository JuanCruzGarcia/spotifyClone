import { useState } from 'react';
import Sidebar from './Sidebar';
import PlaylistTracks from './PlaylistTracks';
import Player from './Player';

const Layout = () => {
  const spotifyToken = localStorage.getItem('spotifyToken');
  const [content, setContent] = useState('home');
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistDetails, setPlaylistDetails] = useState(null);
  const [sidebarWidth, setSidebarWidth] = useState(280);
  const [currentTrack, setCurrentTrack] = useState(null);

  const handleResize = (e) => {
    const newWidth = e.clientX;
    if (newWidth >= 240 && newWidth <= 450) {
      setSidebarWidth(newWidth);
    }
  };

  const stopResize = () => {
    window.removeEventListener('mousemove', handleResize);
    window.removeEventListener('mouseup', stopResize);
  };

  const startResize = () => {
    window.addEventListener('mousemove', handleResize);
    window.addEventListener('mouseup', stopResize);
  };

  const renderContent = () => {
    switch (content) {
      case 'playlist':
        return (
          <PlaylistTracks
            playlistTracks={playlistTracks}
            playlistDetails={playlistDetails}
            setCurrentTrack={setCurrentTrack}
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
      {/* Sidebar con ajuste de altura dinámico */}
      <div 
        className="bg-gray-800 text-white overflow-y-auto custom-scrollbar" 
        style={{ 
          width: `${sidebarWidth}px`, 
          minWidth: '200px', 
          maxWidth: '400px', 
          height: 'calc(100vh - 80px)' // Ajuste para que no se sobreponga al Player
        }}
      >
        <Sidebar
          spotifyToken={spotifyToken}
          setContent={setContent}
          setPlaylistTracks={setPlaylistTracks}
          setPlaylistDetails={setPlaylistDetails}
        />
      </div>

      {/* Resizable Divider */}
      <div className="w-1 bg-black cursor-col-resize" onMouseDown={startResize}></div>

      {/* Main Content */}
      <div className="flex-1 bg-black text-white overflow-y-auto custom-scrollbar pb-20">
        {renderContent()}
      </div>

      {/* Player */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-900 p-4 mt-4">
        <Player
          track={currentTrack} 
          playlistDetails={playlistDetails}
          setCurrentTrack={setCurrentTrack}
        />
      </div>
    </div>
  );
};
export default Layout;