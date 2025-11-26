import { Injectable } from '@nestjs/common';
import { Artist } from './artist.entity';
import { httpErrors } from 'src/handleErrors/http-errors';
import { CreateArtistDto } from './dto/create-artist.dto';
import { randomUUID } from 'crypto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  private artists: Artist[] = [
    {
      id: '5f8c0b3e-0d7a-4e4f-a77f-6cf5e7e3b451',
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
}
