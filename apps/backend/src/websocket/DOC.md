# ========== Waiting [Websocket] ==========

## Connect to Websocket
????? 

## Choix d'une équipe [emit]
Event : waiting
Data Envoyée : 
```
{
  "action": "handle-team",
  "gameCode": "FMRGXU",
  "team": "team1"
}
```
- "Action" permet de choisir l'action désirée, ici "handle-team" pour le choix de team
- "gameCode" permet de spécifier la partie, ici "FMRGXU"
- "team" permet de spécifier la team choisie

## Choix d'une équipe [on]
Event : team-connection-updated
- Success :
```
{
    "status": "success",
    "gameCode": "V2J47H",
    "team": "team1",
    "clientId": "DRSuTGXNcTWblxzKAAAD"
}
```
  - "status" permet de renvoyer l'état de la requête
  - "gameCode" permet de renvoyer le code de la partie affectée
  - "team" permet de renvoyer la team choisie
  - "clientId" permet de renvoyer l'id unique générée lors de la connexion par Socket IO

- Error : 
```
{
    "status": "error",
    "errorCode": "GAME_NOT_FOUND",
    "message": "Game with code YHEVG5 not found"
}

OU 

{
    "status": "error",
    "errorCode": "TEAM_ALREADY_ASSIGNED",
    "message": "Team 1 is already connected with client ID DRSuTGXNcTWblxzKAAAD"
}
```
- "status" permet de renvoyer l'état de la requête
- "errorCode" permet de renvoyer le code associée à l'erreur
- "message" permet d'apporter des précision sur l'erreur


## Recevoir les erreurs [on]
Event : team-connection-error
Data Reçu : ???
C'est ici que vous recevrez toutes les erreurs


## Status de la partie [on]
Event : game-status
Data Reçu : 
```
{
    "gameStatus" : "reflection",
    "gameCode" : "V2J47H"
}
```
- "gameStatus" permet de renvoyer l'état de la la partie
- "gameCode" permet de spécifier la partie



# =========================================