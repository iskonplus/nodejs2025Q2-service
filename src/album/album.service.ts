import { Injectable } from '@nestjs/common';
import { Album } from './album.entity';
import { httpErrors } from 'src/handleErrors/http-errors';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  private albums: Album[] = [
    {
      name: 'The Marshall Maters LP',
      year: 2000,
      artistId: null,
      id: '5f8c0b3e-0d7a-4e4f-a77f-6cf5e7e3b452',
    },
  ];

  getAllAlbums(): Album[] {
    return this.albums;
  }

  findOne(id: string): Album {
    const album = this.albums.find((album) => album.id === id);

    if (!album) throw httpErrors.notFound('Album not found');
    return album;
  }

  create(dto: CreateAlbumDto): Album {
    const newAlbum: Album = {
      id: crypto.randomUUID(),
      name: dto.name,
      year: dto.year,
      artistId: dto.artistId || null,
    };

    this.albums.push(newAlbum);

    return newAlbum;
  }
  updateAlbum(id: string, dto: UpdateAlbumDto): Album {
    const album = this.albums.find((album) => album.id === id);

    if (!album) throw httpErrors.notFound('Album not found');

    album.name = dto.name ?? album.name;
    album.year = dto.year ?? album.year;
    album.artistId = dto.artistId ?? album.artistId;

    return album;
  }

  delete(id: string): void {
    const index = this.albums.findIndex((album) => album.id === id);

    if (index === -1) throw httpErrors.notFound('Album not found');

    this.albums.splice(index, 1);
  }
}
