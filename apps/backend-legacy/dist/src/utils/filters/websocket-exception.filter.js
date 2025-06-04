"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketExceptionFilter = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
let WebsocketExceptionFilter = class WebsocketExceptionFilter extends websockets_1.BaseWsExceptionFilter {
    catch(exception, host) {
        const client = host.switchToWs().getClient();
        const error = exception.getError();
        const errorData = typeof error === 'object'
            ?
                error
            : { message: error };
        const responseChannel = errorData.responseChannel || 'exception';
        console.log(responseChannel);
        const responseData = {
            status: 'error',
        };
        for (const key of Object.keys(errorData)) {
            if (key !== 'responseChannel') {
                responseData[key] = errorData[key];
            }
        }
        client.emit(responseChannel, responseData);
    }
};
exports.WebsocketExceptionFilter = WebsocketExceptionFilter;
exports.WebsocketExceptionFilter = WebsocketExceptionFilter = __decorate([
    (0, common_1.Catch)(websockets_1.WsException)
], WebsocketExceptionFilter);
//# sourceMappingURL=websocket-exception.filter.js.map