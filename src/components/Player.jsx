import { useState, useEffect, useRef } from "react";

const Player = ({ track, playlistDetails, setCurrentTrack, playlistTracks }) => {

  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const isUserAction = useRef(false);
  const spotifyToken = localStorage.getItem("spotifyToken");

  // Efecto para cargar el SDK
  useEffect(() => {
    if (!spotifyToken) return;
    
    if (!window.Spotify && !sdkReady) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.onload = () => {
        window.onSpotifyWebPlaybackSDKReady = () => setSdkReady(true);
      };
      document.body.appendChild(script);
    }
  }, [sdkReady, spotifyToken]);

  // Efecto para inicializar el reproductor
  useEffect(() => {
    if (!sdkReady || !spotifyToken) return;

    const playerInstance = new Spotify.Player({
      name: "Spotify Clone Player",
      getOAuthToken: cb => cb(spotifyToken),
    });

    // Manejador de estado del reproductor
    playerInstance.addListener("player_state_changed", state => {
      if (!state) return;
      
      // Actualizar estado de reproducción primero
      setIsPlaying(!state.paused);
      
      // Sincronizar pista actual desde el SDK
      if (state.track_window.current_track) {
        const newTrack = {
          uri: state.track_window.current_track.uri,
          name: state.track_window.current_track.name,
          artists: state.track_window.current_track.artists,
          album: {
            images: state.track_window.current_track.album.images,
            name: state.track_window.current_track.album.name
          },
          contextUri: playlistDetails?.uri // Añadir contexto aquí
        };
        
        // Actualizar solo si es diferente y no fue acción del usuario
        if (newTrack.uri !== track?.uri && !isUserAction.current) {
          setCurrentTrack(newTrack);
        }
      }
    });

    // Manejador de ready
    playerInstance.addListener("ready", ({ device_id }) => {
      setDeviceId(device_id);
      setPlayer(playerInstance);
      playerInstance.setVolume(0.5).then(() => setVolume(0.5));
      
      // Transferir reproducción al dispositivo
      fetch('https://api.spotify.com/v1/me/player', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${spotifyToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ device_ids: [device_id], play: false })
      });
    });

    playerInstance.connect();
    setPlayer(playerInstance);

    return () => playerInstance.disconnect();
  }, [sdkReady, spotifyToken]);

  // Efecto para manejar la reproducción
  useEffect(() => {
    if (!track?.contextUri || !deviceId || !isUserAction.current) return;

    const playTrack = async () => {
      try {
        await fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            context_uri: track.contextUri,
            offset: { uri: track.uri },
            position_ms: 0
          })
        });
        setIsPlaying(true);
      } catch (error) {
        console.error("Error al reproducir:", error);
      } finally {
        isUserAction.current = false;
      }
    };

    playTrack();
  }, [track, deviceId, spotifyToken]);

  // Controladores de transporte
  const togglePlay = () => {
    if (!player) return;
    isUserAction.current = true;
    player.togglePlay().then(() => setIsPlaying(!isPlaying));
  };

  const nextTrack = () => {
    isUserAction.current = true;
    player.nextTrack().catch(console.error);
  };

  const previousTrack = () => {
    isUserAction.current = true;
    
    player.previousTrack().then(() => {
      // Forzar actualización del estado después de un pequeño delay
      setTimeout(() => {
        isUserAction.current = false;
        player.getCurrentState().then(state => {
          if (state) {
            setCurrentTrack({
              uri: state.track_window.current_track.uri,
              name: state.track_window.current_track.name,
              artists: state.track_window.current_track.artists,
              album: {
                images: state.track_window.current_track.album.images,
                name: state.track_window.current_track.album.name
              }
            });
          }
        });
      }, 100);
    }).catch(err => {
      isUserAction.current = false;
      if (err.message.includes("NO_PREV_TRACK")) {
        // Reiniciar la pista actual si está en el primer track
        fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=0&device_id=${deviceId}`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${spotifyToken}` }
        });
      }
    });
  };

  useEffect(() => {
  if (playlistDetails?.uri && !track?.contextUri) {
    setCurrentTrack(prev => ({
      ...prev,
      contextUri: playlistDetails.uri
    }));
  }
}, [playlistDetails?.uri]);
  
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-black text-white shadow-lg">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-4">
          <img
            src={track?.album?.images[0]?.url || "/placeholder.png"}
            alt={track?.name || "No Track"}
            className="w-16 h-16 rounded"
          />
          <div>
            <h3 className="text-base font-semibold">{track?.name || "No Track"}</h3>
            <p className="text-xs text-gray-400">
              {track?.artists?.map((artist) => artist.name).join(", ") || "Unknown Artist"}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-4">
            <button
              className="text-gray-400 hover:text-white"
              onClick={previousTrack}
            >
              ⏮
            </button>
            <button
              className="bg-green-500 text-white rounded-full p-2 hover:bg-green-600"
              onClick={togglePlay}
            >
              {isPlaying ? "⏸" : "▶️"}
            </button>
            <button
              className="text-gray-400 hover:text-white"
              onClick={nextTrack}
            >
              ⏭
            </button>
            <div className="flex items-center space-x-2 ml-4">
              <span className="text-sm">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => {
                  const newVolume = parseFloat(e.target.value);
                  setVolume(newVolume);
                  if (player) {
                    player.setVolume(newVolume)
                      .catch(error => console.error('Error al cambiar volumen:', error));
                  }
                }}
                className="w-24 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer"
              />
              <span className="text-sm w-12">
                {Math.round(volume * 100)}%
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
