// websocket-exception.filter.ts
import { ArgumentsHost, Catch } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
import { WSResponseDTO } from '../../utils/dto/response.dto';

@Catch(WsException)
export class WebsocketExceptionFilter extends BaseWsExceptionFilter {
  catch(exception: WsException, host: ArgumentsHost) {
    const client = host.switchToWs().getClient();
    const error = exception.getError();

    // Convertir l'erreur en type connu
    const errorData =
      typeof error === 'object'
        ? // biome-ignore lint/suspicious/noExplicitAny: <explanation>
          (error as Record<string, any>)
        : { message: error as string };

    // Extraire le canal de réponse
    const responseChannel = errorData.responseChannel || 'exception';
    console.log(responseChannel);

    // Créer un nouvel objet sans la propriété responseChannel
    const responseData: WSResponseDTO = {
      status: 'error',
    };

    // Copier toutes les propriétés sauf responseChannel
    for (const key of Object.keys(errorData)) {
      if (key !== 'responseChannel') {
        responseData[key] = errorData[key];
      }
    }

    // Émettre l'erreur sur le canal spécifique
    client.emit(responseChannel, responseData);
  }
}
