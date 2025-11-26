import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TrackService } from './track.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
} from '@nestjs/common';

@Controller('track')
export class TrackController {
  constructor(private readonly trackService: TrackService) {}

  @Get()
  getAllTracks() {
    return this.trackService.getAllTracks();
  }

  @Get(':id')
  getTrackById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.trackService.findOne(id);
  }

  @Post()
  createTrack(@Body() dto: CreateTrackDto) {
    return this.trackService.create(dto);
  }

  @Put(':id')
  updateTrack(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Body() dto: UpdateTrackDto,
  ) {
    return this.trackService.updateTrack(id, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.trackService.delete(id);
  }
}
