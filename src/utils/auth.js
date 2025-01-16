const clientId = "3f6124a395c747538d05b3e2037da66c"; // Reemplaza con tu Client ID
const redirectUri = "http://localhost:5173/"; // Reemplaza con tu Redirect URI
const scopes = [
  "user-read-private",
  "user-read-email",
  "playlist-read-private",
  "user-library-read",
];

export const loginUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
  redirectUri
)}&scope=${scopes.join("%20")}&show_dialog=true`;

export const getTokenFromUrl = () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get("access_token");
};