export class Playlist {
    constructor(name, id) {
        this.name = name;
        this.id = id;
    }

    toString() {
        return `Playlist: ${this.name}`;
    }
}