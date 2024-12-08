import { Injectable } from '@nestjs/common';
import { Game } from './interfaces/game.interface';

@Injectable()
export class GameService {
    private games: Game[] = []; //! à remplacer par un stockage redis

    createGame(): Game {
        const newGame: Game = {
            code: this.generateGameCode(),
            isTeam1Connected: false,
            isTeam2Connected: false,
        };
        this.games.push(newGame);
        return newGame;
    }

    createManyGame(i: number) : Game[] {
        let newGames : Game[] = [];
        for (let step = 0; step < i; step++) {
            const newGame: Game = {
                code: this.generateGameCode(),
                isTeam1Connected: false,
                isTeam2Connected: false,
            };
            newGames.push(newGame);
            this.games.push(newGame);
        }
        return newGames;
    }

    private generateGameCode(): string {
        return Math.random().toString(36).substring(2, 8).toUpperCase();
    }

    findAllGames(): Game[] {
        return this.games;
    }
}
