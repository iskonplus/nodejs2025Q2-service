import { ArtistService } from './artist.service';
import { Controller, Get } from '@nestjs/common';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  getAllArtists() {
    return this.artistService.getAllArtists();
  }
}
