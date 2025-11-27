# Home Library Service (NestJS)

A simple Home Library Service built with NestJS.  
The app lets you manage Users, Artists, Albums, Tracks and Favorites (a “home library” of music).

All data is stored **in memory** (no database) according to the task requirements.

---

## 📦 Installation

```bash
git clone https://github.com/iskonplus/nodejs2025Q2-service.git
cd nodejs2025Q2-service

npm install
```
## ⚙️ Environment variables

The project uses a .env file to configure the HTTP port.
	•	.env is ignored by Git (listed in .gitignore).
	•	A template file .env.example is provided in the repository.

Create your local .env file from the example:

```bash
cp .env.example .env
```

## 🚀 Running the application

```bash
npm run start
```
By default, the service will be available at:

```bash
http://localhost:4000
```

## 🧪 Running tests
End-to-end tests are located in the test/ folder and can be run with:

```bash
npm test
```
On a correct implementation you should see all suites passing, for example:
	•	favorites.e2e.spec.ts
	•	artists.e2e.spec.ts
	•	albums.e2e.spec.ts
	•	tracks.e2e.spec.ts
	•	users.e2e.spec.ts

## 🗂 Project structure (high-level)
```bash
src/
  user/
    user.module.ts
    user.controller.ts
    user.service.ts
    user.entity.ts
    dto/
      create-user.dto.ts
      update-password.dto.ts

  artist/
    artist.module.ts
    artist.controller.ts
    artist.service.ts
    artist.entity.ts
    dto/
      create-artist.dto.ts
      update-artist.dto.ts

  album/
    album.module.ts
    album.controller.ts
    album.service.ts
    album.entity.ts
    dto/
      create-album.dto.ts
      update-album.dto.ts

  track/
    track.module.ts
    track.controller.ts
    track.service.ts
    track.entity.ts
    dto/
      create-track.dto.ts
      update-track.dto.ts

  favorites/
    favorites.module.ts
    favorites.controller.ts
    favorites.service.ts
    favorites.entity.ts
    favorites-response.interface.ts
    favorites.store.ts

  common/
    http-errors.ts

  app.module.ts
  main.ts
```

## The code is split by domain (user, artist, album, track, favorites) and follows NestJS conventions:
	•	Controllers handle HTTP (requests/responses, route definitions).
	•	Services contain business logic and in-memory data.
	•	DTOs handle validation of incoming data.
	•	Entities / interfaces describe internal in-memory models.
    
## 👤 Users (/user)

```bash
interface User {
  id: string;        // uuid v4
  login: string;
  password: string;
  version: number;   // increments when password changes
  createdAt: number; // creation timestamp
  updatedAt: number; // last update timestamp
}
```
### Endpoints
	•	GET /user
Returns all users (without passwords).
	•	GET /user/:id
Returns a single user by id.
	•	400 if id is not UUID v4
	•	404 if user not found
	•	POST /user
Creates a new user.
	•	201 + created user (without password)
	•	400 if body is invalid or required fields are missing
	•	PUT /user/:id
Updates user password.
	•	Requires oldPassword and newPassword in body
	•	200 + updated user (without password)
	•	400 if id is invalid
	•	404 if user not found
	•	403 if oldPassword is wrong
	•	DELETE /user/:id
Deletes a user.
	•	204 on success
	•	400 if id is invalid
	•	404 if user not found

## 🎤 Artists (/artist)

```bash
interface Artist {
  id: string;   // uuid v4
  name: string;
  grammy: boolean;
}
```
### Endpoints
	•	GET /artist — get all artists
	•	GET /artist/:id — get artist by id
	•	400 if id invalid
	•	404 if not found
	•	POST /artist — create artist
	•	201 on success
	•	400 if body invalid
	•	PUT /artist/:id — update artist (partial update)
	•	All fields in update DTO are optional
	•	200 on success
	•	400 if id invalid
	•	404 if not found
	•	DELETE /artist/:id — delete artist
	•	204 on success
	•	400 if id invalid
	•	404 if not found

Cascading behavior on artist delete

When an Artist is deleted:
	•	Their id is removed from favorites (if present).
	•	artistId is set to null in all related:
	•	Albums
	•	Tracks

## 💿 Albums (/album)

```bash
interface Album {
  id: string;           // uuid v4
  name: string;
  year: number;
  artistId: string | null; // references Artist or null
}
```

### Endpoints
	•	GET /album — get all albums
	•	GET /album/:id — get album by id
	•	400 if id invalid
	•	404 if not found
	•	POST /album — create album
	•	201 on success
	•	400 if body invalid
	•	PUT /album/:id — update album (partial)
	•	All fields in update DTO are optional
	•	200 on success
	•	400 if id invalid
	•	404 if not found
	•	DELETE /album/:id — delete album
	•	204 on success
	•	400 if id invalid
	•	404 if not found

Cascading behavior on album delete

When an Album is deleted:
	•	Its id is removed from favorites (if present).
	•	albumId is set to null in all related Tracks.

## 🎵 Tracks (/track)

```bash
interface Track {
  id: string;             // uuid v4
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;       // integer
}
```

### Endpoints
	•	GET /track — get all tracks
	•	GET /track/:id — get track by id
	•	400 if id invalid
	•	404 if not found
	•	POST /track — create track
	•	201 on success
	•	400 if body invalid
	•	PUT /track/:id — update track (partial)
	•	All fields in update DTO are optional
	•	200 on success
	•	400 if id invalid
	•	404 if not found
	•	DELETE /track/:id — delete track
	•	204 on success
	•	400 if id invalid
	•	404 if not found

Cascading behavior on track delete

When a Track is deleted:
	•	Its id is removed from favorites (if present).

⸻

## ⭐ Favorites (/favs)

```bash
interface Track {
  id: string;             // uuid v4
  name: string;
  artistId: string | null;
  albumId: string | null;
  duration: number;       // integer
}
```
Internal storage

Favorites are stored by id:

```bash
interface Favorites {
  artists: string[]; // favorite artist ids
  albums: string[];  // favorite album ids
  tracks: string[];  // favorite track ids
}
```
An in-memory singleton store is used:

```bash
export const favoritesStore: Favorites = {
  artists: [],
  albums: [],
  tracks: [],
};
```
Response format for GET /favs

The response must include full objects (not ids):
```bash
interface FavoritesResponse {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}
```

FavoritesService maps stored ids to objects via ArtistService, AlbumService, TrackService.

### Endpoints
	•	GET /favs
	•	200
    •	POST /favs/artist/:id
	•	201 + simple message JSON (e.g. { "message": "Artist added to favorites" }) if artist exists
	•	400 if id is not a UUID v4
	•	422 if artist with this id does not exist
	•	DELETE /favs/artist/:id
	•	204 if artist was in favorites and is now removed
	•	400 if id invalid
	•	404 if artist is not in favorites
	•	POST /favs/album/:id / DELETE /favs/album/:id
	•	Same behavior as for artist, but for albums.
	•	POST /favs/track/:id / DELETE /favs/track/:id
	•	Same behavior as for artist, but for tracks.


