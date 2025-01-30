import React from 'react';

const PlaylistTracks = ({ playlistTracks, playlistDetails, tracks, setCurrentTrack  }) => {
  if (!playlistDetails) return null;

  return (
    <div className="px-2 pt-4">
      <div className="mb-6 flex">
    <img
      src={playlistDetails.images[0]?.url}
      alt={playlistDetails.name}
      className="w-48 h-48 rounded-lg mb-4 mt-4"
    />
    <div className="flex flex-col justify-center ml-4">
      <p className="text-sm font-semibold text-white ml-2">
        {playlistDetails.public ? 'Playlist Pública' : 'Playlist Privada'}
      </p>
      <h1 className="text-7xl font-bold text-white">{playlistDetails.name}</h1>
      <p className="text-sm font-bold text-white mt-3 ml-2">{playlistDetails.owner.display_name}</p>
    </div>
  </div>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto rounded-lg shadow-lg bg-[#121212] text-white">
          <thead>
            <tr>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Titulo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Álbum</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Duración</th>
            </tr>
          </thead>
          <tbody>
            {playlistTracks.map((track, index) => (
              <tr key={track.id} className="hover:bg-[#343434] transition-colors duration-200 h-6" onClick={() => setCurrentTrack(track)}>
                <td className="px-6 py-2 text-sm text-gray-400">{index + 1}</td>
                <td className="px-6 py-2 text-sm flex items-start">
                  <img
                    src={track.album.images[0]?.url}
                    alt={track.name}
                    className="w-12 h-12 object-cover rounded mr-3"
                  />
                  <div className="flex flex-col">
                    <span className="text-base font-semibold">{track.name}</span>
                    <span className="text-gray-400 text-sm font-medium">
                      {track.artists.map((artist) => artist.name).join(', ')}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-2 text-gray-400 text-sm font-medium">{track.album.name}</td>
                <td className="px-6 py-2 text-sm font-medium text-gray-400">
                  {new Date(track.duration_ms).toISOString().substr(14, 5)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PlaylistTracks;