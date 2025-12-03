import { Injectable } from '@nestjs/common';
import { Artist } from './artist.entity';
import { httpErrors } from 'src/handleErrors/http-errors';
import { CreateArtistDto } from './dto/create-artist.dto';
import { randomUUID } from 'crypto';
import { UpdateArtistDto } from './dto/update-artist.dto';
import { AlbumService } from '../album/album.service';
import { TrackService } from '../track/track.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class ArtistService {
  constructor(
    private readonly albumService: AlbumService,
    private readonly trackService: TrackService,
    private readonly favoritesService: FavoritesService,
    private readonly prisma: PrismaService,
  ) {}

  async getAllArtists(): Promise<Artist[]> {
    const artists = await this.prisma.artist.findMany();
    return artists;
  }

  async findOne(id: string): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) throw httpErrors.notFound('Artist not found');
    return artist;
  }

  async create(dto: CreateArtistDto): Promise<Artist> {
    const newArtist: Artist = {
      id: randomUUID(),
      name: dto.name,
      grammy: dto.grammy,
    };

    await this.prisma.artist.create({ data: newArtist });
    return newArtist;
  }

  async updateArtist(id: string, dto: UpdateArtistDto): Promise<Artist> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) throw httpErrors.notFound('Artist not found');

    artist.name = dto.name ?? artist.name;
    artist.grammy = dto.grammy ?? artist.grammy;

    await this.prisma.artist.update({
      where: { id },
      data: artist,
    });

    return artist;
  }

  async deleteArtist(id: string): Promise<void> {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) throw httpErrors.notFound('Artist not found');

    await this.favoritesService.removeArtist(id);
    await this.albumService.clearArtistReferences(id);
    await this.trackService.clearArtistReferences(id);
    await this.prisma.artist.delete({ where: { id } });
  }
}
