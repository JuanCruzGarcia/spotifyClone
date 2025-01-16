import React from 'react';

const PlaylistTracks = ({ playlistTracks }) => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Canciones de la Playlist</h1>
      <ul>
        {playlistTracks.map((track) => (
          <li key={track.id} className="mb-2">
            <p>{track.name} - {track.artists.map((artist) => artist.name).join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PlaylistTracks;