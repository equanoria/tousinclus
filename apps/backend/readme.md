# ========== Game ==========

## Create One Game 
Type : PUT
Root : /games
Cela va créer une game et renvoyer les données sous format JSON

## Create Many Game 
Type : PUT
Root : /games/:numberOfGame
(:numberOfGame -> int)
Cela va créer plusieurs games et renvoyer les données sous format JSON

## Get One Game 
Type : GET
Root : /games/:code
(:code -> string)
Cela va renvoyer les informations de la game sous format json


# ==========================