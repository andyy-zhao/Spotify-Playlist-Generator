import './App.css'
import { useEffect, useState } from "react";
import axios from 'axios';
import { Track } from './functions/Track';
import { Playlist } from './functions/Playlist';
// import { Playlist } from './functions/Playlist';

function App() {
  const client_id = process.env.REACT_APP_CLIENT_ID;
  console.log(process.env);
  const redirect_uri = process.env.REACT_APP_REDIRECT_URI;
  const auth_endpoint = process.env.REACT_APP_AUTH_ENDPOINT;
  const response_type = "token";
  const scope = 'playlist-modify-private playlist-modify-public user-read-recently-played user-library-modify user-read-private user-read-email'

  const [token, setToken] = useState("");
  const [previousListened, setPreviousListened] = useState([]);
  const [showPreviousListened, setShowPreviousListened] = useState(false);
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [checkedCount, setCheckedCount] = useState(0);
  const [selectedSongs, setSelectedSongs] = useState([]);
  const [showRecommendedTracks, setShowRecommendedTracks] = useState(false);
  const [playlistName, setPlaylistName] = useState('');

  useEffect(() => {
    const hash = window.location.hash
    let token = window.localStorage.getItem("token")

    if (!token && hash) {
        token = hash.substring(1).split("&").find(elem => elem.startsWith("access_token")).split("=")[1]

        window.location.hash = ""
        window.localStorage.setItem("token", token)
    }

    setToken(token)

  }, []);

  const logout = () => {
    setToken("")
    window.localStorage.removeItem("token")
  }

  const handlePlaylistNameChange = (e) => {
    setPlaylistName(e.target.value);
  };
  
  const handleGeneratePlaylistClick = async () => {
    const playlist = await createNewPlaylist(playlistName);
    const popPlaylist = await populatePlaylist(playlist, recommendedTracks); 
    return popPlaylist;
  }
  
  const postApiRequest = async (url, data, token) => {
    try {
      const response = await axios.post(url, data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  

  const getApiRequest = async (url, token) => {
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(error);
      return null;
    }
  }

  const getUserId = async () => {
    const url = 'https://api.spotify.com/v1/me';
    const data = await getApiRequest(url, token);
    if (data) {
      console.log(data);
      return data.id;
    }
    return null;
  }

  const getLastPlayedTracks = async (limit) => {
    // e.preventDefault()
    const url = `https://api.spotify.com/v1/me/player/recently-played?limit=${limit}`;
    const data = await getApiRequest(url, token);
    if (data) {
      const tracks = data.items.map(track => {
        return new Track(track.track.name, track.track.id, track.track.artists[0].name);
      })
      setPreviousListened(tracks);
    }
    setShowPreviousListened(true);
  }

  const getTrackRecommendations = async (seedTracks, limit) => {
    const seedTracksUrl = seedTracks.map(track => track.id).join(",");
    console.log(seedTracksUrl);
    const url = `https://api.spotify.com/v1/recommendations?seed_tracks=${seedTracksUrl}&limit=${limit}`;
    const data = await getApiRequest(url, token);
    console.log("Data", data)
    if (data) { 
      const tracks = data.tracks.map(track => {
        return new Track(track.name, track.id, track.artists[0].name);
      })
      console.log(tracks);
      setRecommendedTracks(tracks);
    }
    setShowPreviousListened(false);
    setShowRecommendedTracks(true);
  }

  const createNewPlaylist = async (name) => {
    const userId = await getUserId();
    const url = `https://api.spotify.com/v1/users/${userId}/playlists`;
    const data = JSON.stringify({
      name: name,
      description: "Recommended Songs",
      public: true,
    });
    const res = await postApiRequest(url, data, token);

    const playlistId = res.id;
    const playlist = new Playlist(name, playlistId);
    return playlist;
  }

  const populatePlaylist = async (playlist, tracks) => {
    const trackUris = tracks.map(track => track.getSpotifyUri());
    const data = JSON.stringify({uris: trackUris});
    const url = `https://api.spotify.com/v1/playlists/${playlist.id}/tracks`;
    const response = await postApiRequest(url, data, token);
    console.log(response)
    return response;
  }

  // const renderPreviousListened = () => {
  //   return previousListened.map((track, index) => (
  //     <div key={track.id}>
  //       {`${index + 1}. ${track.toString()}`}
  //     </div>
  //   ))
  // }

  const handleCheckboxChange = (event, track) => {
    if (event.target.checked) {
      setCheckedCount(checkedCount + 1);
      setSelectedSongs([...selectedSongs, track]);
      console.log(selectedSongs);
    } else {
      setCheckedCount(checkedCount - 1);
      setSelectedSongs(selectedSongs.filter(selectedTrack => selectedTrack.id !== track.id));
    }
  }
  

  const renderPreviousListened = () => {
    return previousListened.map((track, index) => (
      <div key={track.id}>
        <input type="checkbox" onChange={(e) => handleCheckboxChange(e, track)} disabled={checkedCount >= 5} />
        {`${index + 1}. ${track.toString()}`}
      </div>
    ))
  }

  const renderRecommendedTracks = () => {
    return (
      <div> <span className="playlist-bar">Name your playlist: </span>
        <input type="text" placeholder="Name" value={playlistName} onChange={handlePlaylistNameChange}/>
        <button onClick={handleGeneratePlaylistClick}>Generate Playlist</button>
        {recommendedTracks.map((track, index) => (
          <div key={track.id}>
            {`${index + 1}. ${track.toString()}`}
          </div>
        ))}
      </div>
    )
  }


  return (
    <div className="App">
        <header className="App-header">
            <h1>Playlist Generator for Spotify</h1>
            {!token ?
                <a href={`${auth_endpoint}?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=${response_type}&scope=${scope}`}>Login
                    to Spotify</a>
                : <button onClick={logout}>Logout</button>}

            {token ?
                <button onClick={() => getLastPlayedTracks(50)}>Click me for recently played songs</button>
                : <h2>Please login</h2>
            } 
            {showPreviousListened ? 
                  <button onClick={() => getTrackRecommendations(selectedSongs, 100)}>
                      Click to generate recommended songs
                  </button>
                : <></>
            }
            
            
            {showPreviousListened ? 
                renderPreviousListened()
                : <></>
            }
            {showRecommendedTracks ?
              renderRecommendedTracks()
              : <></>
            }
            
        </header>
    </div>
  );
}

export default App;
