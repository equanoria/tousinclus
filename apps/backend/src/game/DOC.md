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