import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { WebsocketService } from './websocket.service';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ERole } from '@tousinclus/types';
import { GameDTO } from 'src/game/dto/game.dto';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';

@ApiTags('Notification')
@Roles(ERole.HOST)
@UseGuards(AuthGuard, RolesGuard)
@Controller('notification')
export class NotificationController {
  constructor(private readonly websocketService: WebsocketService) {}

  @Post()
  @ApiOperation({ summary: 'Notify All client connected' })
  @ApiResponse({
    status: 200,
    description: 'Successfully notify all client',
  })
  @ApiBearerAuth('access-token')
  async notifyAll(@Body() message: string) {
    this.websocketService.emitToAll('notification', message);

    return {
      statusCode: HttpStatus.OK,
      message: 'Successfully notify all client',
    };
  }

  @Post(':code')
  @ApiOperation({ summary: 'Notify All client connected' })
  @ApiParam({
    name: 'code',
    example: '187543',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully notify client from room 187543',
  })
  @ApiBearerAuth('access-token')
  async notifyRoom(
    @Param('code') code: GameDTO['code'],
    @Body() message: string,
  ) {
    this.websocketService.emitToRoom(code, 'notification', message);

    return {
      statusCode: HttpStatus.OK,
      message: `Successfully notify client from room ${code}`,
    };
  }
}
