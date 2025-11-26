import { ArtistService } from './artist.service';
import { Controller, Get, Param, ParseUUIDPipe } from '@nestjs/common';

@Controller('artist')
export class ArtistController {
  constructor(private readonly artistService: ArtistService) {}

  @Get()
  getAllArtists() {
    return this.artistService.getAllArtists();
  }

  @Get(':id')
  getArtistById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.artistService.findOne(id);
  }
}
