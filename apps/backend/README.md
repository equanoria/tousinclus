# ============== Game [REST] ==============

## Create One Game 
Type : PUT
Root : /game
Cela va créer une game et renvoyer les données sous format JSON
- Success :
```
{
"code": "RABY67",
"status": "waiting",
"isTeam1Connected": null,
"isTeam2Connected": null
}
```


## Create Many Game 
Type : PUT
Root : /game/:numberOfGame
(:numberOfGame -> int)
Cela va créer plusieurs games et renvoyer les données sous format JSON
- Success :
```
[
  {
    "code": "13V5VI",
    "status": "waiting",
    "isTeam1Connected": null,
    "isTeam2Connected": null
  },
  {
    "code": "V2J47H",
    "status": "waiting",
    "isTeam1Connected": null,
    "isTeam2Connected": null
  }
]
```


## Get All Games
Type : GET
Root : /game
Cela va renvoyer les informations de toute les games en cours sous format json
- Success : 
```
[
  {
    "code": "LRNYYM",
    "status": "waiting",
    "isTeam1Connected": null,
    "isTeam2Connected": null
  },
  {
    "code": "PBEA9K",
    "status": "waiting",
    "isTeam1Connected": null,
    "isTeam2Connected": null
  },
  {
    "code": "3L9838",
    "status": "waiting",
    "isTeam1Connected": "wsYhsdB2WBjFSCD_AAAD",
    "isTeam2Connected": "nN6xTaUMkraWYZFqAAAH"
  }
]
```

- Error : 
```
{
  "message": "Database is empty",
  "error": "Not Found",
  "statusCode": 404
}
```


## Get One Game 
Type : GET
Root : /game/:code
(:code -> string)
Cela va renvoyer les informations de la game sous format json
- Success :
```
{
  "code": "LRNYYM",
  "status": "waiting",
  "isTeam1Connected": null,
  "isTeam2Connected": null
}
```

- Error : 
```
{
  "message": "Game with code M1GOWG not found",
  "error": "Not Found",
  "statusCode": 404
}
```


## Delete One Game 
Type : Delete
Root : /game/:code
(:code -> string)
Cela va supprimer la game spécifiée
- Success :
```
{
  "message": "The game 3L9838 has been successfully deleted",
  "statusCode": 200
}
```

- Error :
```
{
  "message": "Game with code 37HFR not found",
  "error": "Not Found",
  "statusCode": 404
}
```
# =========================================

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
    "gameStatus" : "start",
    "gameCode" : "V2J47H"
}
```
- "gameStatus" permet de renvoyer l'état de la la partie
- "gameCode" permet de spécifier la partie



# =========================================