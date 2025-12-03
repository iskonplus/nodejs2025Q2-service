import { Injectable } from '@nestjs/common';
import { Track } from './track.entity';
import { httpErrors } from 'src/handleErrors/http-errors';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { randomUUID } from 'crypto';
import { PrismaService } from 'src/prisma/prisma.service';
import { FavoritesService } from 'src/favorites/favorites.service';

@Injectable()
export class TrackService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly favoritesService: FavoritesService,
  ) {}

  async getAllTracks(): Promise<Track[]> {
    const tracks = await this.prisma.track.findMany();
    return tracks;
  }

  async findOne(id: string): Promise<Track> {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) throw httpErrors.notFound('Track not found');

    return track;
  }

  async create(dto: CreateTrackDto): Promise<Track> {
    const newTrack = { id: randomUUID(), ...dto };
    await this.prisma.track.create({ data: newTrack });

    return newTrack;
  }

  async updateTrack(id: string, dto: UpdateTrackDto): Promise<Track> {
    const track = await this.prisma.track.findUnique({ where: { id } });

    if (!track) throw httpErrors.notFound('Track not found');

    track.name = dto.name ?? track.name;
    track.artistId = dto.artistId ?? track.artistId;
    track.albumId = dto.albumId ?? track.albumId;
    track.duration = dto.duration ?? track.duration;

    await this.prisma.track.update({ where: { id }, data: track });
    return track;
  }

  async delete(id: string): Promise<void> {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) throw httpErrors.notFound('Track not found');

    await this.favoritesService.removeTrack(id);
    await this.prisma.track.delete({ where: { id } });
  }

  async clearArtistReferences(artistId: string): Promise<void> {
    await this.prisma.track.updateMany({
      where: { artistId },
      data: { artistId: null },
    });
  }

  async clearAlbumReferences(albumId: string): Promise<void> {
    await this.prisma.track.updateMany({
      where: { albumId },
      data: { albumId: null },
    });
  }
}
