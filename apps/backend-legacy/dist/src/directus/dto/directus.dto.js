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
exports.IDeckDTO = exports.IGroupDTO = exports.ICardDTO = exports.ITranslationDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class ITranslationDTO {
}
exports.ITranslationDTO = ITranslationDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Requested language',
        example: 'en',
    }),
    __metadata("design:type", String)
], ITranslationDTO.prototype, "requestLanguage", void 0);
class ICardDTO extends ITranslationDTO {
}
exports.ICardDTO = ICardDTO;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiProperty)({
        description: 'ID of the card',
        example: 42,
    }),
    __metadata("design:type", Number)
], ICardDTO.prototype, "id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Type of the card',
        example: 'users',
        enum: ['users', 'situations'],
    }),
    __metadata("design:type", String)
], ICardDTO.prototype, "type", void 0);
class IGroupDTO extends ITranslationDTO {
}
exports.IGroupDTO = IGroupDTO;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiProperty)({
        description: 'ID of the card group',
        example: 10,
    }),
    __metadata("design:type", Number)
], IGroupDTO.prototype, "id", void 0);
class IDeckDTO extends ITranslationDTO {
}
exports.IDeckDTO = IDeckDTO;
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, swagger_1.ApiProperty)({
        description: 'ID of the deck',
        example: 5,
    }),
    __metadata("design:type", Number)
], IDeckDTO.prototype, "id", void 0);
//# sourceMappingURL=directus.dto.js.map