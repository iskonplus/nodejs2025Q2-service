import { Injectable } from '@nestjs/common';
import { Album } from './album.entity';
import { httpErrors } from 'src/handleErrors/http-errors';
import { CreateAlbumDto } from './dto/create-album.dto';

@Injectable()
export class AlbumService {
  private albums: Album[] = [
    {
      name: 'The Marshall Mathers LP',
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
}
