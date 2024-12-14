import { Injectable } from '@nestjs/common';
import { GameService } from '../game/game.service'
import { Socket } from 'socket.io';

@Injectable()
export class WaitingService {

    constructor(private readonly gameService: GameService) { } // Injection du GameService

    async handleWaitingLogic(client: Socket, data: any): Promise<void> {
        // Vérification de l'action
        const action = data?.action;

        // Permet de trigger la bonne logique selon l'action
        switch (action) {
            case 'handle-team':
                // Appel de la méthode pour gérer la connexion d'une équipe
                await this.handleTeamConnection(client, data.gameCode, data.team, client.id);
                break;

            default:
                // Emission d'une erreur en cas d'action non reconnue
                client.emit('error', { message: 'Action non reconnue', action });
        }
    }

    async handleTeamConnection(client: Socket, gameCode: string, team: 'team1' | 'team2', clientId: string): Promise<void> {
        try {
            // Appel au service pour mettre à jour le statut de la connexion d'une équipe
            const updatedGame = await this.gameService.updateTeamConnectionStatus(gameCode, team, clientId);

            // Notifier le client que l'état a été mis à jour
            client.emit('team-connection-updated', { status: 'success', gameCode, team, clientId });

            console.log(`Updated game: ${JSON.stringify(updatedGame)}`);
        } catch (error) {
            console.error(`Error updating team connection: ${error.message}`);
            
            // Gérer les cas spécifiques
            let errorCode = 'GENERIC_ERROR';
            if (error.message.includes('not found')) {
                errorCode = 'GAME_NOT_FOUND';
            } else if (error.message.includes('already connected')) {
                errorCode = 'TEAM_ALREADY_ASSIGNED';
            }

            // Renvoyer une réponse d'erreur structurée au client
            client.emit('team-connection-error', {
                status: 'error',
                errorCode,
                message: error.message,
            });
        }
    }
}
