import React from 'react';

const PlaylistTracks = ({ playlistTracks }) => {
  return (
    <div className="px-2 pt-4 pb-2">
      <h1 className="text-3xl font-bold text-white mb-6">Canciones de la Playlist</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto rounded-lg shadow-lg bg-black text-white">
          <thead>
            <tr className="">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">#</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Titulo</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Álbum</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-400">Duración</th>
            </tr>
          </thead>
          <tbody>
            {playlistTracks.map((track, index) => (
              <tr key={track.id} className="hover:bg-[#343434] transition-colors duration-200 h-6">
                <td className="px-6 py-2 text-sm text-gray-400">{index + 1}</td>
                <td className="px-6 py-2 text-sm flex items-start">
                  <img
                    src={track.album.images[0]?.url}
                    alt={track.name}
                    className="w-12 h-12 object-cover rounded mr-3"
                  />
                  <div className="flex flex-col">
                    <span className='text-base font-semibold'>{track.name}</span>
                    <span className="text-gray-400 text-sm font-medium">{track.artists.map((artist) => artist.name).join(', ')}</span>
                  </div>
                </td>
                <td className="px-6 py-2 text-gray-400 text-sm font-medium">{track.album.name}</td>
                <td className="px-6 py-2 text-sm font-medium text-gray-400">
                <td className="px-6 py-2 text-sm font-medium text-gray-400">
                  {track.duration_ms
                    ? new Date(track.duration_ms).toISOString().substr(14, 5)
                    : "N/A"}
                </td>
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