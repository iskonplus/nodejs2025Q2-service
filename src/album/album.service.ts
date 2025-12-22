import { Injectable } from '@nestjs/common';
import { Album } from './album.entity';
import { httpErrors } from 'src/handleErrors/http-errors';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlbumService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllAlbums(): Promise<Album[]> {
    const albums = await this.prisma.album.findMany();
    return albums;
  }

  async findOne(id: string): Promise<Album> {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) throw httpErrors.notFound('Album not found');
    return album;
  }

  async create(dto: CreateAlbumDto): Promise<Album> {
    const newAlbum: Album = {
      id: crypto.randomUUID(),
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId || null,
    };

    await this.prisma.album.create({ data: newAlbum });

    return newAlbum;
  }
  async updateAlbum(id: string, dto: UpdateAlbumDto): Promise<Album> {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) throw httpErrors.notFound('Album not found');

    album.name = dto.name ?? album.name;
    album.year = dto.year ?? album.year;
    album.artistId = dto.artistId ?? album.artistId;

    await this.prisma.album.update({
      where: { id },
      data: album,
    });

    return album;
  }

  async delete(id: string): Promise<void> {
    const album = await this.prisma.album.findUnique({ where: { id } });

    if (!album) throw httpErrors.notFound('Album not found');
    await this.prisma.album.delete({ where: { id } });
  }
}
