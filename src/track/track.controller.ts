import { TrackService } from './track.service';
import { Controller, Get } from '@nestjs/common';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getAllTracks() {
    return this.trackService.getAllTracks();
  }
}
