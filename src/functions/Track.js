export class Track {
    // A track is a song
    constructor(name, id, artist) {
      this.name = name;
      this.id = id;
      this.artist = artist;
    }
  
    // id of song
    getSpotifyUri() {
      return `spotify:track:${this.id}`;
    }
  
    // returns string
    toString() {
      return `${this.name} by ${this.artist}`;
    }
}
  