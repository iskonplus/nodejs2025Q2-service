import { Injectable } from '@nestjs/common';
import { Track } from './track.entity';
import { httpErrors } from 'src/handleErrors/http-errors';

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
}
