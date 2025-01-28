import axios from "axios";

const spotifyApi = axios.create({
  baseURL: "https://api.spotify.com/v1",
});

export const setAuthToken = (token) => {
  spotifyApi.defaults.headers.common["Authorization"] = `Bearer ${token}`;
};

export const getUserProfile = async () => {
  const response = await spotifyApi.get("/me");
  return response.data;
};

export const getPlaylists = async (spotifyToken) => {
    const url = "https://api.spotify.com/v1/me/playlists";
  
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
          "Content-Type": "application/json",
        },
      });
  
      if (response.status === 401) {
        localStorage.removeItem("spotifyToken");
        window.location.href = "/";
      }
  
      if (!response.ok) {
        throw new Error("Error fetching playlists");
      }
  
      const data = await response.json();
      return data.items;
    } catch (error) {
      console.error("Error fetching playlists:", error);
      return [];
    }
  };

  export const getPlaylistTracks = async (playlistId, spotifyToken) => {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    });
    
    if (response.status === 401) {
      localStorage.removeItem("spotifyToken");
      window.location.href = "/";
      return [];
    }
  
    if (!response.ok) {
      throw new Error('Failed to fetch playlist tracks');
    }
  
    const data = await response.json();
    return data.items.map(item => item.track);
  };
  
  export const getPlaylistDetails = async (playlistId, spotifyToken) => {
    const response = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${spotifyToken}`,
      },
    });
  
    if (response.status === 401) {
      localStorage.removeItem('spotifyToken');
      window.location.href = '/';
      return null;
    }
  
    if (!response.ok) {
      throw new Error('Failed to fetch playlist details');
    }
  
    const data = await response.json();
    return data;
  };
  
  export const transferPlayback = async (deviceId, spotifyToken) => {
    try {
      const url = `https://api.spotify.com/v1/me/player`;
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${spotifyToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          device_ids: [deviceId],
          play: true, // Puedes cambiar esto según lo que necesites
        }),
      });
  
      if (!response.ok) {
        throw new Error("Error al transferir la reproducción");
      }
  
      console.log("Reproducción transferida exitosamente");
    } catch (error) {
      console.error("Error en transferPlayback:", error);
    }
  };