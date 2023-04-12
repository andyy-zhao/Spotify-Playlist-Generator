# Playlist Generator For Spotify

Welcome to the Playlist Generator for Spotify! This application allows you to generate new Spotify playlists in your Spotify Library based on your top 50 previously listened songs. From your previously listened songs, select up to 5 songs to use as seed tracks. View the 100 generated recommended tracks, and choose a title for your playlist. Click Generate Playlist and go to your Spotify Library to see the new playlist! 

## Features
* Displays 50 of your most recently listened to songs 
* Displays 100 recommended songs based on the seed tracks you selected
* Generates Spotify Playlist with custom playlist name

## Screenshots
<img src="/src/assets/screenshots/previous.png?raw=true" alt="Previously Listened" width="400"> <img src="/src/assets/screenshots/generate.png?raw=true" alt="Generated" width="350">

## Installation and Setup
These instructions will get you a copy of the project up and running on your local machine. As of now, this is the only way for you to be able to access this application as a way to maintain personal privacy. 

### Prerequisites
Clone this repository. You will need ```npm``` installed on your local machine. You will also need to create a Spotify App on your Spotify account. Set the redirect URI to http://localhost:3000. You will also need to create a ```.env``` file in the root folder of the project. In the .env file, copy and paste this code, replacing {spotify_app_client_id} with the Client ID of your spotify app. You can obtain the Client ID by going to settings in your spotify app.
```
REACT_APP_CLIENT_ID={spotify_app_client_id}
REACT_APP_REDIRECT_URI=http://localhost:3000
REACT_APP_AUTH_ENDPOINT=https://accounts.spotify.com/authorize
REACT_APP_RESPONSE_TYPE=token
```

Once this is completed, follow these steps to get the project running: 

### Installation: 
Run ```npm install``` in the terminal in the root folder. 

### To Start Application: 
Run ```npm start``` in the terminal in the root folder. 

The application should now be running on http://localhost:3000/
