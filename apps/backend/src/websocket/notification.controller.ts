import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import { ApiTags } from '@nestjs/swagger';
import { ERole } from '@tousinclus/types';
import { AuthGuard } from 'src/game/auth/auth.guard';
import { Roles } from 'src/game/auth/roles.decorator';
import { RolesGuard } from 'src/game/auth/roles.guard';
import { GameDTO } from 'src/game/dto/game.dto';

@ApiTags('Notification')
@Roles(ERole.HOST)
@UseGuards(AuthGuard, RolesGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly websocketService: WebsocketService) {}

  @Post()
  async notifyAll(@Body() message: string) {
    this.websocketService.emitToAll('notification', message);
  }

  @Post(':code')
  async notifyRoom(
    @Param('code') code: GameDTO['code'],
    @Body() message: string,
  ) {
    this.websocketService.emitToRoom(code, 'notification', message);
  }
}
