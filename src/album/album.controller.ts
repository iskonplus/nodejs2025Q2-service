import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';

@Controller('album')
export class AlbumController {
  constructor(readonly albumService: AlbumService) {}

  @Get()
  getAllAlbums() {
    return this.albumService.getAllAlbums();
  }

  @Get(':id')
  getAlbumById(@Param('id', new ParseUUIDPipe({ version: '4' })) id: string) {
    return this.albumService.findOne(id);
  }

  @Post()
  createAlbum(@Body() dto: CreateAlbumDto) {
    return this.albumService.create(dto);
  }
}
