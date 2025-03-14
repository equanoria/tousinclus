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
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

// ========== DTO Import ==========
import { CreateGameDTO, IGameDTO } from './dto/game.dto';

// ========== Service Import ==========
import { GameService } from './game.service';
import { IHTTPResponseDTO } from 'src/utils/dto/response.dto';

@ApiTags('game')
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
    type: IHTTPResponseDTO,
  })
  @ApiResponse({
    status: 201,
    description: 'The game has been successfully created',
    type: IGameDTO,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: IHTTPResponseDTO,
  })
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
    type: [IGameDTO],
  })
  @ApiResponse({
    status: 404,
    description: 'Specified Deck with the given id not found',
    type: IHTTPResponseDTO,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: IHTTPResponseDTO,
  })
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
  @ApiOperation({ summary: 'Retrieve a game by its code' })
  @ApiParam({
    name: 'code',
    description: 'The unique code of the game',
    example: '119949',
  })
  @ApiResponse({
    status: 200,
    description: 'The game was found and returned successfully',
    type: IGameDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Game not found',
    type: IHTTPResponseDTO,
  })
  async getOneGame(@Param('code') code: IGameDTO['code']): Promise<IGameDTO> {
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
    type: [IGameDTO],
  })
  @ApiResponse({
    status: 404,
    description: 'No games found in the database',
    type: IHTTPResponseDTO,
  })
  async getAllGames(): Promise<IGameDTO[]> {
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
    type: IHTTPResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Game not found',
    type: IHTTPResponseDTO,
  })
  async deleteOneGame(@Param('code') code: string): Promise<IHTTPResponseDTO> {
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
