"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ETeam = exports.EDebateStatus = exports.EGameStatus = void 0;
var EGameStatus;
(function (EGameStatus) {
    EGameStatus["WAITING"] = "waiting";
    EGameStatus["REFLECTION"] = "reflection";
    EGameStatus["DEBATE"] = "debate";
    EGameStatus["RESULT"] = "result";
})(EGameStatus || (exports.EGameStatus = EGameStatus = {}));
var EDebateStatus;
(function (EDebateStatus) {
    EDebateStatus["NEXT_CARD"] = "next_card";
    EDebateStatus["END_PHASE"] = "end_phase";
    EDebateStatus["RETRY"] = "retry";
})(EDebateStatus || (exports.EDebateStatus = EDebateStatus = {}));
var ETeam;
(function (ETeam) {
    ETeam["TEAM1"] = "team1";
    ETeam["TEAM2"] = "team2";
})(ETeam || (exports.ETeam = ETeam = {}));
//# sourceMappingURL=IGame.js.map