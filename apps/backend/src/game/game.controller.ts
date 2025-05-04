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
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// ========== DTO Import ==========
import { CreateGameDTO, GameDTO } from './dto/game.dto';

// ========== Service Import ==========
import { GameService } from './game.service';
import { HTTPResponseDTO } from 'src/utils/dto/response.dto';
import { AuthGuard } from './auth/auth.guard';

@ApiTags('Game')
@UseGuards(AuthGuard)
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
    required: false, // indicates that the body is optional
  })
  @ApiResponse({
    status: 404,
    description: 'Specified Deck with id xxx not found',
    type: HTTPResponseDTO,
  })
  @ApiResponse({
    status: 201,
    description: 'The game has been successfully created',
    type: GameDTO,
  })
  createGame(@Body() createGameDto: CreateGameDTO): Promise<GameDTO> {
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
  @ApiOperation({ summary: 'Create multiple games' })
  @ApiParam({
    name: 'numberOfGame',
    description: 'The number of games to create',
    example: 5,
  })
  @ApiBody({
    description:
      'Game creation data. The body is optional (example: { deckId: 1 }).',
    type: CreateGameDTO,
    required: false, // indicates that the body is optional
  })
  @ApiResponse({
    status: 201,
    description: 'The games have been successfully created',
    type: [GameDTO],
  })
  @ApiResponse({
    status: 404,
    description: 'Specified Deck with the given id not found',
    type: HTTPResponseDTO,
  })
  createManyGame(
    @Body() createGameDto: CreateGameDTO,
    @Param('numberOfGame', ParseIntPipe)
    numberOfGame: number,
  ): Promise<GameDTO[]> {
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
  async getOneGame(@Param('code') code: GameDTO['code']): Promise<GameDTO> {
    const game = await this.gameService.findOneGame(code);
    if (!game) {
      throw new NotFoundException(`Game with code ${code} not found`);
    }
    return game;
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
  async getAllGames(): Promise<GameDTO[]> {
    const allGames = await this.gameService.findAllGames();
    if (!allGames || allGames.length === 0) {
      throw new NotFoundException('Database is empty');
    }
    return allGames;
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
  async deleteAllGames(): Promise<GameDTO[]> {
    const deleteAllGames = await this.gameService.deleteAllGames();
    if (deleteAllGames.length === 0) {
      throw new NotFoundException('Database is empty');
    }
    return deleteAllGames;
  }
}
