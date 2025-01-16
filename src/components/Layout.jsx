import { useState } from 'react';
import Sidebar from './Sidebar';
import PlaylistTracks from './PlaylistTracks';

  const Layout = ({ children }) => {
    const spotifyToken = localStorage.getItem('spotifyToken');
    const [content, setContent] = useState('home'); // Estado para manejar qué contenido se muestra
    const [playlistTracks, setPlaylistTracks] = useState([]);  // Estado para manejar las canciones de la playlist
  
    const renderContent = () => {
      switch (content) {
        case 'home':
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold">Bienvenido a Spotify Clone</h1>
              <p>Selecciona una playlist o explora tu música favorita.</p>
            </div>
          );
        case 'search':
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold">Buscar</h1>
              <p>Busca tus canciones, artistas o álbumes favoritos.</p>
            </div>
          );
        case 'library':
          return (
            <div className="p-6">
              <h1 className="text-2xl font-bold">Tu Biblioteca</h1>
              <p>Aquí están tus playlists y canciones guardadas.</p>
            </div>
          );
          case 'playlist':
        return <PlaylistTracks playlistTracks={playlistTracks} />; 
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
        <Sidebar spotifyToken={spotifyToken} setContent={setContent} setPlaylistTracks={setPlaylistTracks} />
        <div className="flex-1 bg-gray-900 text-white overflow-y-auto">
          {renderContent()}
        </div>
      </div>
    );
  };
  
  export default Layout;