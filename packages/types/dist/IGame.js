//#region src/IGame.ts
let EGameStatus = /* @__PURE__ */ function(EGameStatus$1) {
	EGameStatus$1["WAITING"] = "waiting";
	EGameStatus$1["REFLECTION"] = "reflection";
	EGameStatus$1["DEBATE"] = "debate";
	EGameStatus$1["RESULT"] = "result";
	return EGameStatus$1;
}({});
let EDebateStatus = /* @__PURE__ */ function(EDebateStatus$1) {
	EDebateStatus$1["NEXT_CARD"] = "next_card";
	EDebateStatus$1["END_PHASE"] = "end_phase";
	EDebateStatus$1["RETRY"] = "retry";
	return EDebateStatus$1;
}({});
let ETeam = /* @__PURE__ */ function(ETeam$1) {
	ETeam$1["TEAM1"] = "team1";
	ETeam$1["TEAM2"] = "team2";
	return ETeam$1;
}({});

//#endregion
export { EDebateStatus, EGameStatus, ETeam };