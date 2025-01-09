import { Injectable } from '@nestjs/common';
import { GameService } from '../game/game.service';
import { Server, Socket } from 'socket.io';

@Injectable()
export class WaitingService {
  constructor(private readonly gameService: GameService) {} // Injection du GameService

  async handleWaitingLogic(
    server: Server,
    client: Socket,
    data: any,
  ): Promise<void> {
    // Vérification de l'action
    const action = data?.action;

    // Permet de trigger la bonne logique selon l'action
    switch (action) {
      case 'handle-team':
        // Appel de la méthode pour gérer la connexion d'une équipe
        await this.handleTeamConnection(
          server,
          client,
          data.gameCode,
          data.team,
          client.id,
        );
        break;

      default:
        // Emission d'une erreur en cas d'action non reconnue
        client.emit('error', { message: 'Action non reconnue', action });
    }
  }

  async handleTeamConnection(
    server,
    client: Socket,
    gameCode: string,
    team: string,
    clientId: string,
  ): Promise<void> {
    try {
      // Permet de mettre au bon format le champ Team
      team = team.toLowerCase().replace(/\s/g, '');

      // Appel au service pour mettre à jour le statut de la connexion d'une équipe
      const updatedGame = await this.gameService.updateTeamConnectionStatus(
        gameCode,
        team,
        clientId,
      );

      // Enregistre dans le client Socket IO le Code et la Team
      client.data.team = team;
      client.data.gameCode = gameCode;

      // Ajoute le client à une "room" SocketIO
      client.join(gameCode);

      // Notifier le client que l'état a été mis à jour
      client.emit('team-connection-updated', {
        status: 'success',
        gameCode,
        team,
        clientId,
      });

      console.log(`Updated game (Team Choice): ${JSON.stringify(updatedGame)}`);

      const isReadyToStart =
        await this.gameService.checkIfReadyToStart(gameCode);

      if (isReadyToStart) {
        // Envoie un message à tout les participants de la room
        server
          .to(gameCode)
          .emit('game-status', { gameStatus: 'start', gameCode });

        // Todo : Passer le status au status suivant
      }
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
