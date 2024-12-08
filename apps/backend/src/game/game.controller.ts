import { Controller, Post, Get, Put, Param, ParseIntPipe } from '@nestjs/common';
import { GameService } from './game.service';
import { Game } from './interfaces/game.interface';

@Controller('games')
export class GameController {
    constructor(private readonly gameService: GameService) { }

    @Put()
    createGame(): Game {
        return this.gameService.createGame();
    }

    @Put(':numberOfGame')
    createManyGame(@Param('numberOfGame', ParseIntPipe) numberOfGame: number): Game[] {
        console.log(numberOfGame);
        return this.gameService.createManyGame(numberOfGame);
    }

    @Get()
    getAllGames(): Game[] {
        return this.gameService.findAllGames();
    }
}
