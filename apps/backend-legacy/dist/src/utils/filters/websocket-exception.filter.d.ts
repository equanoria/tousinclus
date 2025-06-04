import { ArgumentsHost } from '@nestjs/common';
import { BaseWsExceptionFilter, WsException } from '@nestjs/websockets';
export declare class WebsocketExceptionFilter extends BaseWsExceptionFilter {
    catch(exception: WsException, host: ArgumentsHost): void;
}
