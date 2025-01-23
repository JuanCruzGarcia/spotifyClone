const clientId = "3f6124a395c747538d05b3e2037da66c"; 
const redirectUri = "http://localhost:5173/"; 
const scopes = [
  "user-read-private",     
  "user-read-email",            
  "playlist-read-private",     
  "user-library-read",          
  "streaming",                  
  "user-read-playback-state",   
  "user-modify-playback-state"
];

export const loginUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&redirect_uri=${encodeURIComponent(
  redirectUri
)}&scope=${scopes.join("%20")}&show_dialog=true`;

export const getTokenFromUrl = () => {
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get("access_token");
};