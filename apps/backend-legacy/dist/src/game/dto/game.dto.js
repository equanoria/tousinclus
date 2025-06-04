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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameDTO = exports.TeamDTO = exports.VoteDTO = exports.AnswerDTO = exports.AnswerDataDTO = exports.CreateGameDTO = void 0;
const swagger_1 = require("@nestjs/swagger");
const types_1 = require("@tousinclus/types");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
class CreateGameDTO {
}
exports.CreateGameDTO = CreateGameDTO;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, swagger_1.ApiProperty)({
        description: 'Identifier of the associated deck (optional)',
        example: 1,
    }),
    __metadata("design:type", Number)
], CreateGameDTO.prototype, "deckId", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, swagger_1.ApiProperty)({
        description: 'Duration of the reflection part',
        example: 15,
    }),
    __metadata("design:type", Number)
], CreateGameDTO.prototype, "reflectionDuration", void 0);
class AnswerDataDTO {
}
exports.AnswerDataDTO = AnswerDataDTO;
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Answer 1',
        example: 'example answer 1',
    }),
    __metadata("design:type", String)
], AnswerDataDTO.prototype, "input1", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Answer 2',
        example: 'example answer 2',
    }),
    __metadata("design:type", String)
], AnswerDataDTO.prototype, "input2", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Answer 3',
        example: 'example answer 3',
    }),
    __metadata("design:type", String)
], AnswerDataDTO.prototype, "input3", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsNumber)({}, { each: true }),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Checkboxes answer',
        example: [1, 2, 8],
        type: [Number],
    }),
    __metadata("design:type", Array)
], AnswerDataDTO.prototype, "inputCheckboxes", void 0);
class AnswerDTO {
}
exports.AnswerDTO = AnswerDTO;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Card ID',
        example: 42,
    }),
    __metadata("design:type", Number)
], AnswerDTO.prototype, "cardId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Team information team1 | team2',
        enum: types_1.ETeam,
    }),
    __metadata("design:type", typeof (_a = typeof types_1.ETeam !== "undefined" && types_1.ETeam) === "function" ? _a : Object)
], AnswerDTO.prototype, "team", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_validator_1.ValidateNested)(),
    (0, class_transformer_1.Type)(() => AnswerDataDTO),
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Answer data',
        type: AnswerDataDTO,
        nullable: true,
    }),
    __metadata("design:type", AnswerDataDTO)
], AnswerDTO.prototype, "answer", void 0);
class VoteDTO {
}
exports.VoteDTO = VoteDTO;
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Card ID',
        example: 42,
    }),
    __metadata("design:type", Number)
], VoteDTO.prototype, "cardId", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Votes cast by each team. Each vote contains the team who voted and the team they voted for.',
        example: [
            { team: 'team1', vote: 'team2' },
            { team: 'team2', vote: 'team1' },
        ],
    }),
    __metadata("design:type", Array)
], VoteDTO.prototype, "votes", void 0);
class TeamDTO {
}
exports.TeamDTO = TeamDTO;
__decorate([
    (0, class_validator_1.IsBoolean)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Is the team connected?', example: true }),
    __metadata("design:type", Boolean)
], TeamDTO.prototype, "isConnected", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)({ groups: ['room'] }),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Socket IO client ID',
        example: 'aqzsedrftgyhujikolp',
        nullable: true,
    }),
    __metadata("design:type", String)
], TeamDTO.prototype, "clientId", void 0);
class GameDTO {
}
exports.GameDTO = GameDTO;
__decorate([
    (0, class_validator_1.IsDate)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)({ groups: ['admin'] }),
    __metadata("design:type", Date)
], GameDTO.prototype, "createdAt", void 0);
__decorate([
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)({ groups: ['admin'] }),
    __metadata("design:type", Object)
], GameDTO.prototype, "createdBy", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDate)(),
    (0, class_transformer_1.Expose)({ groups: ['room'] }),
    __metadata("design:type", Date)
], GameDTO.prototype, "reflectionEndsAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    (0, class_transformer_1.Expose)({ groups: ['admin'] }),
    __metadata("design:type", String)
], GameDTO.prototype, "_id", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({ description: 'Game code', example: '119949' }),
    __metadata("design:type", String)
], GameDTO.prototype, "code", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    (0, class_validator_1.IsNotEmpty)(),
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiProperty)({
        description: 'Game status',
        example: 'waiting',
        enum: types_1.EGameStatus,
    }),
    __metadata("design:type", String)
], GameDTO.prototype, "status", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Time for Reflection phase in minutes',
        example: 60,
    }),
    __metadata("design:type", Number)
], GameDTO.prototype, "reflectionDuration", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)(),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Card group identifier',
        example: 14,
    }),
    __metadata("design:type", Number)
], GameDTO.prototype, "cardGroupId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)({ groups: ['team1', 'joining'] }),
    (0, class_transformer_1.Type)(() => TeamDTO),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'First team information',
        type: TeamDTO,
    }),
    __metadata("design:type", TeamDTO)
], GameDTO.prototype, "team1", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_transformer_1.Expose)({ groups: ['team2', 'joining'] }),
    (0, class_transformer_1.Type)(() => TeamDTO),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Second team information',
        type: TeamDTO,
    }),
    __metadata("design:type", TeamDTO)
], GameDTO.prototype, "team2", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => AnswerDTO),
    (0, class_transformer_1.Expose)({ groups: ['reflection'] }),
    (0, swagger_1.ApiPropertyOptional)({
        description: 'Answers associated with the team',
        type: AnswerDTO,
    }),
    __metadata("design:type", Array)
], GameDTO.prototype, "answers", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => VoteDTO),
    (0, class_transformer_1.Expose)({ groups: ['debate'] }),
    __metadata("design:type", Array)
], GameDTO.prototype, "votes", void 0);
//# sourceMappingURL=game.dto.js.map