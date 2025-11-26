import { FavoritesService } from './favorites.service';
import { Controller, Get } from '@nestjs/common';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAllFavorites() {
    return this.favoritesService.getAllFavorites();
  }
}
