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
exports.WSResponseDTO = exports.HTTPResponseDTO = exports.ResponseDTO = exports.ErrorCode = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
var ErrorCode;
(function (ErrorCode) {
    ErrorCode["GENERIC_ERROR"] = "GENERIC_ERROR";
    ErrorCode["NOT_FOUND"] = "NOT_FOUND";
    ErrorCode["UNAUTHORIZED"] = "UNAUTHORIZED";
    ErrorCode["FORBIDDEN"] = "FORBIDDEN";
    ErrorCode["INTERNAL_ERROR"] = "INTERNAL_ERROR";
    ErrorCode["VALIDATION_FAILED"] = "VALIDATION_FAILED";
    ErrorCode["CONFLICT_ERROR"] = "CONFLICT_ERROR";
    ErrorCode["BAD_REQUEST"] = "BAD_REQUEST";
})(ErrorCode || (exports.ErrorCode = ErrorCode = {}));
class ResponseDTO {
}
exports.ResponseDTO = ResponseDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Response message',
        example: 'Operation completed successfully',
    }),
    __metadata("design:type", String)
], ResponseDTO.prototype, "message", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Error code if any error occurred',
        example: 'NOT_FOUND',
        enum: ErrorCode,
    }),
    __metadata("design:type", String)
], ResponseDTO.prototype, "errorCode", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Additional data returned',
        example: { id: 1, value: 'example' },
    }),
    __metadata("design:type", Object)
], ResponseDTO.prototype, "errors", void 0);
class HTTPResponseDTO extends ResponseDTO {
}
exports.HTTPResponseDTO = HTTPResponseDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.IsNumber)(),
    (0, swagger_1.ApiProperty)({
        description: 'HTTP status code of the response',
        example: 200,
    }),
    __metadata("design:type", Number)
], HTTPResponseDTO.prototype, "statusCode", void 0);
class WSResponseDTO extends ResponseDTO {
}
exports.WSResponseDTO = WSResponseDTO;
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'WebSocket response status',
        example: 'success',
        enum: ['success', 'error', 'failed', 'forbidden'],
    }),
    __metadata("design:type", String)
], WSResponseDTO.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], WSResponseDTO.prototype, "responseChannel", void 0);
__decorate([
    (0, class_validator_1.IsObject)(),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], WSResponseDTO.prototype, "data", void 0);
//# sourceMappingURL=response.dto.js.map