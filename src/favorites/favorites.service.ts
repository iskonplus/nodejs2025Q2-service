import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { FavoritesResponse } from './favorites-response.interface';
import { httpErrors } from '../handleErrors/http-errors';

@Injectable()
export class FavoritesService {
  constructor(private readonly prisma: PrismaService) {}

  private async getFavorites() {
    return this.prisma.favorites.findFirst();
  }

  private async createFavorites() {
    return this.prisma.favorites.create({ data: {} });
  }

  async getAllFavorites(): Promise<FavoritesResponse> {
    const fav = await this.prisma.favorites.findFirst({
      include: {
        artists: { include: { artist: true } },
        albums: { include: { album: true } },
        tracks: { include: { track: true } },
      },
    });

    if (!fav) return { artists: [], albums: [], tracks: [] };

    return {
      artists: fav.artists.map((a) => a.artist),
      albums: fav.albums.map((a) => a.album),
      tracks: fav.tracks.map((t) => t.track),
    };
  }

  async addArtist(id: string) {
    const artist = await this.prisma.artist.findUnique({ where: { id } });
    if (!artist) throw httpErrors.unprocessable('Artist does not exist');

    let fav = await this.getFavorites();
    if (!fav) fav = await this.createFavorites();

    const exists = await this.prisma.favoritesArtist.findFirst({
      where: { favoritesId: fav.id, artistId: id },
    });

    if (!exists) {
      await this.prisma.favoritesArtist.create({
        data: { favoritesId: fav.id, artistId: id },
      });
    }

    return { message: `Artist ${artist.name} added to favorites` };
  }

  async removeArtist(id: string) {
    const fav = await this.getFavorites();
    if (!fav) throw httpErrors.notFound('Artist not in favorites');

    const deleted = await this.prisma.favoritesArtist.deleteMany({
      where: { favoritesId: fav.id, artistId: id },
    });

    if (deleted.count === 0)
      throw httpErrors.notFound('Artist not in favorites');
  }

  async addAlbum(id: string) {
    const album = await this.prisma.album.findUnique({ where: { id } });
    if (!album) throw httpErrors.unprocessable('Album does not exist');

    let fav = await this.getFavorites();
    if (!fav) fav = await this.createFavorites();

    const exists = await this.prisma.favoritesAlbum.findFirst({
      where: { favoritesId: fav.id, albumId: id },
    });

    if (!exists) {
      await this.prisma.favoritesAlbum.create({
        data: { favoritesId: fav.id, albumId: id },
      });
    }

    return { message: `Album ${album.name} added to favorites` };
  }

  async removeAlbum(id: string) {
    const fav = await this.getFavorites();
    if (!fav) throw httpErrors.notFound('Album not in favorites');

    const deleted = await this.prisma.favoritesAlbum.deleteMany({
      where: { favoritesId: fav.id, albumId: id },
    });

    if (deleted.count === 0)
      throw httpErrors.notFound('Album not in favorites');
  }

  async addTrack(id: string) {
    const track = await this.prisma.track.findUnique({ where: { id } });
    if (!track) throw httpErrors.unprocessable('Track does not exist');

    let fav = await this.getFavorites();
    if (!fav) fav = await this.createFavorites();

    const exists = await this.prisma.favoritesTrack.findFirst({
      where: { favoritesId: fav.id, trackId: id },
    });

    if (!exists) {
      await this.prisma.favoritesTrack.create({
        data: { favoritesId: fav.id, trackId: id },
      });
    }

    return { message: `Track ${track.name} added to favorites` };
  }

  async removeTrack(id: string) {
    const fav = await this.getFavorites();
    if (!fav) throw httpErrors.notFound('Track not in favorites');

    const deleted = await this.prisma.favoritesTrack.deleteMany({
      where: { favoritesId: fav.id, trackId: id },
    });

    if (deleted.count === 0)
      throw httpErrors.notFound('Track not in favorites');
  }
}
