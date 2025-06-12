import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  ParseIntPipe,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// ========== DTO Import ==========
import { CreateGameDTO, GameDTO } from './dto/game.dto';

import { ERole, type IUser } from '@tousinclus/types';
import { HTTPResponseDTO } from 'src/utils/dto/response.dto';
import { ParseDatePipe } from 'src/utils/pipes/parse-date.pipe';
import { AuthGuard } from './auth/auth.guard';
import { Roles } from './auth/roles.decorator';
import { RolesGuard } from './auth/roles.guard';
// ========== Service Import ==========
import { GameService } from './game.service';
import { ERole, IUser } from '@tousinclus/types';
import { ParseDatePipe } from 'src/utils/pipes/parse-date.pipe';

// ========== Utils Import ==========
import { Response } from 'express';
import { User } from 'src/utils/decorators/user.decorator';
import { AuthGuard } from 'src/auth/auth.guard';
import { Roles } from 'src/auth/roles/roles.decorator';
import { RolesGuard } from 'src/auth/roles/roles.guard';

@ApiTags('Game')
@Roles(ERole.HOST)
@UseGuards(AuthGuard, RolesGuard)
@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Put()
  @HttpCode(201)
  @ApiOperation({ summary: 'Create one game' })
  @ApiBody({
    description:
      'Game creation data. The body is optional (example: { deckId: 1 }).',
    type: CreateGameDTO,
    required: false,
  })
  @ApiResponse({
    status: 201,
    description: 'The game has been successfully created',
    type: GameDTO,
  })
  @ApiBearerAuth('access-token')
  createGame(
    @Body() createGameDto: CreateGameDTO,
    @User() user: IUser,
  ): Promise<GameDTO> {
    const game = this.gameService.createGame({ ...createGameDto }, user);
    if (!game) {
      throw new HttpException(
        'Failed to create a game',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return game;
  }

  @Put(':numberOfGame')
  @HttpCode(201)
  @ApiOperation({ summary: 'Create many games' })
  @ApiParam({
    name: 'numberOfGame',
    description: 'The number of games to create (max 20)',
    example: 5,
  })
  @ApiBody({
    description:
      'Game creation data. The body is optional (example: { deckId: 1 }).',
    type: CreateGameDTO,
    required: false,
  })
  @ApiResponse({
    status: 201,
    description: 'The games have been successfully created',
    type: [GameDTO],
  })
  @ApiBearerAuth('access-token')
  async createManyGame(
    @Body() createGameDto: CreateGameDTO,
    @User() user: IUser,
    @Param('numberOfGame', ParseIntPipe) numberOfGame: number,
  ): Promise<GameDTO[]> {
    if (numberOfGame > 20) {
      throw new HttpException(
        'You can create a maximum of 20 games at once',
        HttpStatus.BAD_REQUEST,
      );
    }
    const games = await this.gameService.createManyGame(
      numberOfGame,
      {
        ...createGameDto,
      },
      user,
    );
    if (!games) {
      throw new HttpException(
        `Failed to create ${numberOfGame} games`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return games;
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all games' })
  @ApiResponse({
    status: 200,
    description: 'Successfully retrieved all games',
    type: [GameDTO],
  })
  @ApiResponse({
    status: 404,
    description: 'No games found in the database',
    type: HTTPResponseDTO,
  })
  @ApiBearerAuth('access-token')
  async getAllGames(): Promise<GameDTO[]> {
    const allGames = await this.gameService.findAllGames();
    if (!allGames || allGames.length === 0) {
      throw new NotFoundException('Database is empty');
    }
    return allGames;
  }

  @Get(':code')
  @ApiOperation({ summary: 'Retrieve a game by its code' })
  @ApiParam({
    name: 'code',
    description: 'The unique code of the game',
    example: '119949',
  })
  @ApiResponse({
    status: 200,
    description: 'The game was found and returned successfully',
    type: GameDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Game not found',
    type: HTTPResponseDTO,
  })
  @ApiBearerAuth('access-token')
  async getOneGame(@Param('code') code: GameDTO['code']): Promise<GameDTO> {
    const game = await this.gameService.findOneGame(code);
    if (!game) {
      throw new NotFoundException(`Game with code ${code} not found`);
    }
    return game;
  }

  @Delete(':code')
  @ApiOperation({ summary: 'Delete a game by its code' })
  @ApiParam({
    name: 'code',
    description: 'Unique game code to delete',
    example: '119949',
  })
  @ApiResponse({
    status: 200,
    description: 'The game has been successfully deleted',
    type: HTTPResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Game not found',
    type: HTTPResponseDTO,
  })
  @ApiBearerAuth('access-token')
  async deleteOneGame(@Param('code') code: string): Promise<HTTPResponseDTO> {
    const game = await this.gameService.deleteOneGame(code);
    if (!game) {
      throw new NotFoundException(`Game with code ${code} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      message: `The game ${code} has been successfully deleted`,
    };
  }

  @Delete()
  @ApiOperation({ summary: 'Delete all games' })
  @ApiResponse({
    status: 200,
    description: 'Successfully delete all games',
    type: [GameDTO],
  })
  @ApiResponse({
    status: 404,
    description: 'No games found in the database',
    type: HTTPResponseDTO,
  })
  @ApiBearerAuth('access-token')
  async deleteAllGames(): Promise<GameDTO[]> {
    const deleteAllGames = await this.gameService.deleteAllGames();
    if (deleteAllGames.length === 0) {
      throw new NotFoundException('Database is empty');
    }
    return deleteAllGames;
  }

  @Get('/export/:date.csv')
  @ApiOperation({ summary: 'Export games for a specific date' })
  @ApiParam({
    name: 'date',
    example: '06-06-2025',
    format: 'DD-MM-YYYY',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully export games',
  })
  @ApiResponse({
    status: 404,
    description: 'No games found for this date',
    type: HTTPResponseDTO,
  })
  @ApiBearerAuth('access-token')
  async exportGames(
    @Param('date', ParseDatePipe) date: Date,
    @Res() res: Response,
  ): Promise<void> {
    const gamesCSV = await this.gameService.exportGameByDate(date);

    if (!gamesCSV) {
      throw new NotFoundException(
        `No game found for the provided date : ${date}.`,
      );
    }

    res.header('Content-Type', 'text/csv');
    res.header('Content-Disposition', 'attachment; filename="games.csv"');
    res.send(gamesCSV);
  }
}
