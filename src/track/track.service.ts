import { Injectable } from '@nestjs/common';
import { Track } from './track.entity';
import { httpErrors } from 'src/handleErrors/http-errors';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { randomUUID } from 'crypto';

@Injectable()
export class TrackService {
  private tracks: Track[] = [
    {
      id: '5f8c0b3e-0d7a-4e4f-a77f-6cf5e7e3b453',
      name: 'Track 1',
      artistId: null,
      albumId: null,
      duration: 210,
    },
  ];

  getAllTracks(): Track[] {
    return this.tracks;
  }

  findOne(id: string): Track {
    const track = this.tracks.find((track) => track.id === id);
    if (!track) throw httpErrors.notFound('Track not found');

    return track;
  }

  create(dto: CreateTrackDto): Track {
    const newTrack = { id: randomUUID(), ...dto };
    this.tracks.push(newTrack);

    return newTrack;
  }

  updateTrack(id: string, dto: UpdateTrackDto): Track {
    const track = this.tracks.find((track) => track.id === id);

    if (!track) throw httpErrors.notFound('Track not found');

    track.name = dto.name ?? track.name;
    track.artistId = dto.artistId ?? track.artistId;
    track.albumId = dto.albumId ?? track.albumId;
    track.duration = dto.duration ?? track.duration;

    return track;
  }

  delete(id: string): void {
    const index = this.tracks.findIndex((track) => track.id === id);
    if (index === -1) throw httpErrors.notFound('Track not found');

    this.tracks.splice(index, 1);
  }
}
