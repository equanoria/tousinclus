import { Module } from '@nestjs/common';
import { GamesService } from './games.service';
import { RoomsModule } from 'src/rooms/rooms.module';

@Module({
  imports: [RoomsModule],
  providers: [GamesService],
  exports: [GamesService],
})
export class GamesModule {}
