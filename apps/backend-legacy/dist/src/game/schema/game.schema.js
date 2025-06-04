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
var _a, _b, _c;
Object.defineProperty(exports, "__esModule", { value: true });
exports.GameSchema = exports.GameDocument = exports.Vote = exports.TeamVote = exports.Answer = exports.AnswerData = exports.User = void 0;
const mongoose_1 = require("@nestjs/mongoose");
const types_1 = require("@tousinclus/types");
const mongoose_2 = require("mongoose");
let User = class User {
};
exports.User = User;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String }),
    __metadata("design:type", String)
], User.prototype, "id", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: [String] }),
    __metadata("design:type", Array)
], User.prototype, "roles", void 0);
exports.User = User = __decorate([
    (0, mongoose_1.Schema)()
], User);
let AnswerData = class AnswerData {
};
exports.AnswerData = AnswerData;
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], AnswerData.prototype, "input1", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], AnswerData.prototype, "input2", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: String }),
    __metadata("design:type", String)
], AnswerData.prototype, "input3", void 0);
__decorate([
    (0, mongoose_1.Prop)({ type: [Number] }),
    __metadata("design:type", Array)
], AnswerData.prototype, "inputCheckboxes", void 0);
exports.AnswerData = AnswerData = __decorate([
    (0, mongoose_1.Schema)()
], AnswerData);
let Answer = class Answer {
};
exports.Answer = Answer;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Answer.prototype, "cardId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String }),
    __metadata("design:type", typeof (_a = typeof types_1.ETeam !== "undefined" && types_1.ETeam) === "function" ? _a : Object)
], Answer.prototype, "team", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: AnswerData }),
    __metadata("design:type", AnswerData)
], Answer.prototype, "answer", void 0);
exports.Answer = Answer = __decorate([
    (0, mongoose_1.Schema)()
], Answer);
let TeamVote = class TeamVote {
};
exports.TeamVote = TeamVote;
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: types_1.ETeam }),
    __metadata("design:type", typeof (_b = typeof types_1.ETeam !== "undefined" && types_1.ETeam) === "function" ? _b : Object)
], TeamVote.prototype, "team", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, enum: types_1.ETeam }),
    __metadata("design:type", typeof (_c = typeof types_1.ETeam !== "undefined" && types_1.ETeam) === "function" ? _c : Object)
], TeamVote.prototype, "vote", void 0);
exports.TeamVote = TeamVote = __decorate([
    (0, mongoose_1.Schema)()
], TeamVote);
let Vote = class Vote {
};
exports.Vote = Vote;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], Vote.prototype, "cardId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: [TeamVote] }),
    __metadata("design:type", Array)
], Vote.prototype, "votes", void 0);
exports.Vote = Vote = __decorate([
    (0, mongoose_1.Schema)()
], Vote);
let GameDocument = class GameDocument extends mongoose_2.Document {
};
exports.GameDocument = GameDocument;
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Date }),
    __metadata("design:type", Date)
], GameDocument.prototype, "createdAt", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: User }),
    __metadata("design:type", Object)
], GameDocument.prototype, "createdBy", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: String }),
    __metadata("design:type", String)
], GameDocument.prototype, "code", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: Number }),
    __metadata("design:type", Number)
], GameDocument.prototype, "cardGroupId", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: [Answer] }),
    __metadata("design:type", Array)
], GameDocument.prototype, "answers", void 0);
__decorate([
    (0, mongoose_1.Prop)({ required: true, type: [Vote] }),
    __metadata("design:type", Array)
], GameDocument.prototype, "votes", void 0);
exports.GameDocument = GameDocument = __decorate([
    (0, mongoose_1.Schema)({ timestamps: true })
], GameDocument);
exports.GameSchema = mongoose_1.SchemaFactory.createForClass(GameDocument);
//# sourceMappingURL=game.schema.js.map