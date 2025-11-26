import { AlbumService } from '../album/album.service';
import { ArtistService } from '../artist/artist.service';
import { TrackService } from '../track/track.service';
import { Injectable } from '@nestjs/common';
import { favoritesStore } from './favorites.store';
import { FavoritesResponse } from './favorites-response.interface';
import { httpErrors } from 'src/handleErrors/http-errors';

@Injectable()
export class FavoritesService {
  constructor(
    private readonly artistService: ArtistService,
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  getAllFavorites(): FavoritesResponse {
    const artists = favoritesStore.artists.map((id) =>
      this.artistService.findOne(id),
    );

    const albums = favoritesStore.albums.map((id) =>
      this.albumService.findOne(id),
    );

    const tracks = favoritesStore.tracks.map((id) =>
      this.trackService.findOne(id),
    );

    return { artists, albums, tracks };
  }

  addArtist(id: string) {
    try {
      const artist = this.artistService.findOne(id);
      if (!favoritesStore.artists.includes(id)) {
        favoritesStore.artists.push(id);
      }

      return { message: `Artist: ${artist.name} added to favorites` };
    } catch {
      throw httpErrors.unprocessable('Artist does not exist');
    }
  }

  removeArtist(id: string): void {
    const index = favoritesStore.artists.indexOf(id);
    if (index === -1) {
      throw httpErrors.notFound('Artist not found in favorites');
    }
    favoritesStore.artists.splice(index, 1);
  }

  addAlbum(id: string) {
    try {
      const album = this.albumService.findOne(id);
      if (!favoritesStore.albums.includes(id)) {
        favoritesStore.albums.push(id);
      }

      return { message: `Album: ${album.name} added to favorites` };
    } catch {
      throw httpErrors.unprocessable('Album does not exist');
    }
  }

  removeAlbum(id: string): void {
    const index = favoritesStore.albums.indexOf(id);
    if (index === -1) {
      throw httpErrors.notFound('Album not found in favorites');
    }
    favoritesStore.albums.splice(index, 1);
  }
}
