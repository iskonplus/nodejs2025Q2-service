import { Injectable } from '@nestjs/common';
import { Artist } from './artist.entity';
import { httpErrors } from 'src/handleErrors/http-errors';
import { CreateArtistDto } from './dto/create-artist.dto';
import { randomUUID } from 'crypto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { favoritesStore } from '../favorites/favorites.store';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
  ) {}

  private artists: Artist[] = [
    {
      id: '5f8c0b3e-0d7a-4e4f-a77f-6cf5e7e3b452',
      name: 'Artist One',
      grammy: true,
    },
  ];

  getAllArtists(): Artist[] {
    return this.artists;
  }

  findOne(id: string): Artist {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) throw httpErrors.notFound('Artist not found');
    return artist;
  }

  create(dto: CreateArtistDto): Artist {
    const newArtist: Artist = {
      id: randomUUID(),
      name: dto.name,
      grammy: dto.grammy,
    };

    this.artists.push(newArtist);
    return newArtist;
  }

  updateArtist(id: string, dto: UpdateArtistDto): Artist {
    const artist = this.artists.find((artist) => artist.id === id);
    if (!artist) throw httpErrors.notFound('Artist not found');

    artist.name = dto.name ?? artist.name;
    artist.grammy = dto.grammy ?? artist.grammy;

    return artist;
  }

  deleteArtist(id: string): void {
    const artistIndex = this.artists.findIndex((artist) => artist.id === id);
    if (artistIndex === -1) throw httpErrors.notFound('Artist not found');

    this.artists.splice(artistIndex, 1);

    favoritesStore.artists = favoritesStore.artists.filter(
      (artistId) => artistId !== id,
    );

    this.albumService.clearArtistReferences(id);
    this.trackService.clearArtistReferences(id);
  }
}
