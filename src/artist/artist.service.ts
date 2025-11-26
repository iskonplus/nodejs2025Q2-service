import { Injectable } from '@nestjs/common';
import { Artist } from './artist.entity';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [
    {
      id: '111a1111-1a11-1a11-1a11-111a111a1111',
      name: 'Artist One',
      grammy: true,
    },
  ];

  getAllArtists(): Artist[] {
    return this.artists;
  }
}
