import { Injectable } from '@nestjs/common';
import { Track } from './track.entity';

@Injectable()
export class TrackService {
  private tracks: Track[] = [
    {
      id: '1',
      name: 'Track 1',
      artistId: null,
      albumId: null,
      duration: 210,
    },
  ];

  getAllTracks(): Track[] {
    return this.tracks;
  }
}
