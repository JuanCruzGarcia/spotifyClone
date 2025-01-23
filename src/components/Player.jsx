import { useState, useEffect, useRef } from "react";

const Player = ({ track }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [player, setPlayer] = useState(null);
  const [sdkReady, setSdkReady] = useState(false);
  const spotifyToken = localStorage.getItem("spotifyToken");

  useEffect(() => {
    if (!spotifyToken) {
      console.error("No se encontró el token de Spotify.");
      return;
    }

    if (window.Spotify && sdkReady) {
      const playerInstance = new Spotify.Player({
        name: "Spotify Clone Player",
        getOAuthToken: (cb) => {
          cb(spotifyToken);
        },
        volume: 0.5,
      });

      playerInstance.addListener("ready", ({ device_id }) => {
        console.log("Reproductor listo con ID: ", device_id);
        setPlayer(playerInstance);
      });

      playerInstance.addListener("player_state_changed", (state) => {
        if (!state) return;
        setIsPlaying(state.paused === false);
      });

      playerInstance.connect();

      return () => {
        playerInstance.disconnect();
      };
    }
  }, [spotifyToken, sdkReady]);

  useEffect(() => {
    if (!window.Spotify && !sdkReady) {
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.onload = () => setSdkReady(true);
      document.body.appendChild(script);
    } else {
      setSdkReady(true);
    }
  }, [sdkReady]);

  const togglePlay = () => {
    if (!player) return;

    if (isPlaying) {
      player.pause();
    } else {
      player.resume();
    }
  };

  const playTrack = (uri) => {
    if (!player) return;

    player.play({
      uris: [uri],
    }).then(() => {
      console.log("Pista iniciada correctamente");
    }).catch((err) => {
      console.error("Error al intentar reproducir la pista: ", err);
    });
  };

  useEffect(() => {
    if (track?.uri) {
      playTrack(track.uri);
    }
  }, [track]);

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 text-white shadow-lg">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-4">
          <img
            src={track?.album?.images[0]?.url || "/placeholder.png"}
            alt={track?.name || "No Track"}
            className="w-16 h-16 rounded"
          />
          <div>
            <h3 className="text-lg font-semibold">{track?.name || "No Track"}</h3>
            <p className="text-sm text-gray-400">
              {track?.artists?.map((artist) => artist.name).join(", ") || "Unknown Artist"}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-center">
          <div className="flex items-center space-x-4">
            <button
              className="text-gray-400 hover:text-white"
              onClick={() => console.log("Previous Track")}
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
              onClick={() => console.log("Next Track")}
            >
              ⏭
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Player;
