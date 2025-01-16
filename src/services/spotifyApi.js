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
        // Token expirado
        localStorage.removeItem("spotifyToken");
        window.location.href = "/login"; // Redirige al login
        return [];
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
      // Token expirado
      localStorage.removeItem("spotifyToken");
      window.location.href = "/login"; // Redirige al login
      return [];
    }
  
    if (!response.ok) {
      throw new Error('Failed to fetch playlist tracks');
    }
  
    const data = await response.json();
    return data.items.map(item => item.track); // Solo devolver las canciones
  };
