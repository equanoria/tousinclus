"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WebsocketValidationPipe = void 0;
const common_1 = require("@nestjs/common");
const websockets_1 = require("@nestjs/websockets");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const response_dto_1 = require("../dto/response.dto");
let WebsocketValidationPipe = class WebsocketValidationPipe {
    constructor(responseChannel) {
        this.responseChannel = responseChannel;
        this.responseChannel = responseChannel || 'exception';
    }
    async transform(value, metadata) {
        const { metatype } = metadata;
        if (!metatype || !this.toValidate(metatype)) {
            return value;
        }
        const object = (0, class_transformer_1.plainToInstance)(metatype, value);
        const errors = await (0, class_validator_1.validate)(object, {
            whitelist: true,
            forbidUnknownValues: true,
            stopAtFirstError: false,
        });
        if (errors.length > 0) {
            const formattedErrors = this.formatErrorsDeep(errors);
            const errorObject = {
                status: 'error',
                errorCode: response_dto_1.ErrorCode.VALIDATION_FAILED,
                message: 'Validation failed. See errors for further details.',
                responseChannel: this.responseChannel,
                errors: formattedErrors,
            };
            throw new websockets_1.WsException(errorObject);
        }
        return object;
    }
    toValidate(metatype) {
        const types = [String, Boolean, Number, Array, Object];
        return !types.includes(metatype);
    }
    formatErrorsDeep(errors, parentPath = '') {
        return errors.flatMap((err) => {
            const path = parentPath ? `${parentPath}.${err.property}` : err.property;
            const currentError = err.constraints
                ? [{ property: path, constraints: err.constraints }]
                : [];
            const childErrors = err.children?.length
                ? this.formatErrorsDeep(err.children, path)
                : [];
            return [...currentError, ...childErrors];
        });
    }
};
exports.WebsocketValidationPipe = WebsocketValidationPipe;
exports.WebsocketValidationPipe = WebsocketValidationPipe = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [String])
], WebsocketValidationPipe);
//# sourceMappingURL=websocket-validation.pipe.js.map