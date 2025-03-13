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
} from '@nestjs/common';

// ========== DTO Import ==========
import { CreateGameDTO, IGameDTO } from './dto/game.dto';

// ========== Service Import ==========
import { GameService } from './game.service';
import { IHTTPResponseDTO } from 'src/utils/dto/response.dto';

@Controller('game')
export class GameController {
  constructor(private readonly gameService: GameService) {}

  @Put()
  @HttpCode(201)
  createGame(@Body() createGameDto: CreateGameDTO): Promise<IGameDTO> {
    const game = this.gameService.createGame({ ...createGameDto });
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
  createManyGame(
    @Body() createGameDto: CreateGameDTO,
    @Param('numberOfGame', ParseIntPipe)
    numberOfGame: number,
  ): Promise<IGameDTO[]> {
    const games = this.gameService.createManyGame(numberOfGame, {
      ...createGameDto,
    });
    if (!games) {
      throw new HttpException(
        `Failed to create ${numberOfGame} games`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
    return games;
  }

  @Get(':code')
  async getOneGame(@Param('code') code: IGameDTO['code']): Promise<IGameDTO> {
    const game = await this.gameService.findOneGame(code);
    if (!game) {
      throw new NotFoundException(`Game with code ${code} not found`);
    }
    return game;
  }

  @Get()
  async getAllGames(): Promise<IGameDTO[]> {
    const allGames = await this.gameService.findAllGames();
    if (!allGames || allGames.length === 0) {
      throw new NotFoundException('Database is empty');
    }
    return allGames;
  }

  @Delete(':code')
  async DeleteOneGame(@Param('code') code: string): Promise<IHTTPResponseDTO> {
    const game = await this.gameService.deleteOneGame(code);
    if (!game) {
      throw new NotFoundException(`Game with code ${code} not found`);
    }
    return {
      statusCode: HttpStatus.OK,
      message: `The game ${code} has been successfully deleted`,
    };
  }
}
