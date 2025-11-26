import { AlbumService } from 'src/album/album.service';
import { ArtistService } from './../artist/artist.service';
import { Injectable } from '@nestjs/common';
import { TrackService } from 'src/track/track.service';
import { favoritesStore } from './favorites.store';
import { FavoritesResponse } from './favorites-response.interface';

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
}
