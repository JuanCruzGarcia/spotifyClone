import { useState, useEffect } from "react";

const Player = ({ track, playlistDetails, setCurrentTrack }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const [sdkReady, setSdkReady] = useState(false);
  const [deviceId, setDeviceId] = useState(null);
  const [volume, setVolume] = useState(0.5);
  const spotifyToken = localStorage.getItem("spotifyToken");

  useEffect(() => {
    if (!spotifyToken) {
      console.error("No se encontró el token de Spotify.");
      return;
    }
    if (!window.Spotify && !sdkReady) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.onload = () => {
        window.onSpotifyWebPlaybackSDKReady = () => {
          setSdkReady(true);
          console.log("SDK de Spotify cargado correctamente.");
        };
      };
      document.body.appendChild(script);
    } else if (!sdkReady) {
      setSdkReady(true);
    }
  }, [sdkReady]);

  useEffect(() => {
    if (sdkReady && spotifyToken) {
      console.log("Iniciando reproductor de Spotify...");
      const playerInstance = new Spotify.Player({
        name: "Spotify Clone Player",
        getOAuthToken: (cb) => {
          cb(spotifyToken);
        },
      });
      playerInstance.addListener("ready", ({ device_id }) => {
        console.log("Reproductor listo con ID: ", device_id);
        setDeviceId(device_id);
        setPlayer(playerInstance);
        
        playerInstance.setVolume(0.5)
          .then(() => {
            console.log("Volumen inicial establecido a 0.5");
            setVolume(0.5);
          })
          .catch(error => console.error("Error al establecer volumen:", error));
      
        fetch('https://api.spotify.com/v1/me/player', {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${spotifyToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            device_ids: [device_id],
            play: false
          })
        });
      });
  
      playerInstance.addListener("player_state_changed", (state) => {
        if (!state) return;
        console.log("Estado del reproductor cambiado:", state);
        setIsPlaying(state.paused === false);
        
      
        if (!state.paused) {
          console.log("Reproducción iniciada...");
        } else {
          console.log("Reproducción pausada.");
        }
      });
  
      playerInstance.connect().then((success) => {
        if (success) {
          console.log("Reproductor conectado exitosamente");
        } else {
          console.error("No se pudo conectar el reproductor.");
        }
      });
  
      return () => {
        playerInstance.disconnect();
      };
    }
  }, [sdkReady, spotifyToken]);

  const togglePlay = () => {
    if (!player) return;
  
    player.togglePlay()
      .then(() => setIsPlaying(!isPlaying))
      .catch(err => {
        if (err.message.includes('DEVICE_NOT_CONTROLLABLE')) {
        }
      });
  };

  useEffect(() => {
    if (track?.uri && deviceId && playlistDetails?.uri) {
      console.log("Iniciando reproducción con contexto de playlist...");
      
      fetch(`https://api.spotify.com/v1/me/player/play?device_id=${deviceId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${spotifyToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          context_uri: playlistDetails.uri, // Usar URI de la playlist
          offset: { uri: track.uri },       // Especificar track inicial
          position_ms: 0
        })
      })
      .then(response => {
        if (!response.ok) throw new Error('Error al reproducir');
        setIsPlaying(true);
      })
      .catch(console.error);
    }
  }, [track, deviceId, spotifyToken, playlistDetails?.uri]);
  
  const nextTrack = () => {
    console.log("Botón siguiente pista presionado.");
    if (!player) return;

    player.nextTrack().then(() => {
      console.log("Siguiente pista");
    }).catch((err) => {
      console.error("Error al intentar avanzar a la siguiente pista: ", err);
    });
  };

  const previousTrack = () => {
    if (!player) return;
  
    player.previousTrack().catch(err => {
      console.error("Error en previousTrack:", err);
      // Si hay error, forzar reinicio de pista
      if (err.message.includes("NO_PREV_TRACK")) {
        fetch(`https://api.spotify.com/v1/me/player/seek?position_ms=0&device_id=${deviceId}`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${spotifyToken}`
          }
        });
      }
    });
  };

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
