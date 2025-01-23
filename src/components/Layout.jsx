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
      <div
        className="w-1 bg-gray-600 cursor-col-resize"
        onMouseDown={startResize}
      ></div>
      <div className="flex-1 bg-gray-900 text-white overflow-y-auto overflow-y-scroll custom-scrollbar">
        {renderContent()}
      </div>
      <Player track={currentTrack} />
    </div>
  );
};

export default Layout;