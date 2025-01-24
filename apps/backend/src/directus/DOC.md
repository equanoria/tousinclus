# ============== Game [REST] ==============

## Get One Card
Type : GET
Root : /directus/:languageCode/card/:type/:id
Cela va renvoyer la carte demandée dans la catégorie spécifiée
(:languageCode -> en | fr)
(:type -> "users" | "situations" | "design-for-all")
(:id -> int)
- Success :
```
[
  {
    "image": "9a112b7b-efe1-4d8f-a27f-d9c80563e363",
    "context": "À l'hôtel",
    "description": "je dois obtenir les clés de ma chambre et aller dans ma chambre à l'étage"
  }
]
```


## Get All Card
Type : GET
Root : /directus/:languageCode/card/:type
(:languageCode -> en | fr)
(:type -> "users" | "situations" | "design-for-all")
Cela va renvoyer toute les cartes de la catégorie
- Success :
```
[
  {
    "image": "9a112b7b-efe1-4d8f-a27f-d9c80563e363",
    "handicap_category": {
      "icon": "8986960c-e1e0-42ac-9445-6912256f1744",
      "category_name": "Handicap category"
    },
    "description": "Hello card user"
  },
  {
    "image": "8986960c-e1e0-42ac-9445-6912256f1744",
    "handicap_category": {
      "icon": "8986960c-e1e0-42ac-9445-6912256f1744",
      "category_name": "Handicap category"
    },
    "description": "Hello Card User 2"
  }
]
```


## Get One Group
Type : GET
Root : /directus/:languageCode/group/:id
(:languageCode -> en | fr)
(:id -> int)
Cela va renvoyer les informations du group ayant un id 1
- Success : 
```
[
  {
    "title": "Group One",
    "usage_situation": {
      "image": "9a112b7b-efe1-4d8f-a27f-d9c80563e363",
      "context": "At the hotel",
      "description": "I need to get the keys to my room and go to my room upstairs."
    },
    "extreme_user": [
      ...
    ]
  }
]
```

## Get All Group
Type : GET
Root : /directus/:languageCode/group
(:languageCode -> en | fr)
Cela va renvoyer les informations de tout les groups
- Success :
```
[
  {
    "title": "Group One",
    "usage_situation": {
      "image": "9a112b7b-efe1-4d8f-a27f-d9c80563e363",
      "context": "At the hotel",
      "description": "I need to get the keys to my room and go to my room upstairs."
    },
    "extreme_user": [
      ...
    ]
  },
  {
    "title": "Group Two",
    "usage_situation": {
      "image": "9a112b7b-efe1-4d8f-a27f-d9c80563e363",
      "context": "At the hotel",
      "description": "I need to get the keys to my room and go to my room upstairs."
    },
    "extreme_user": [
      ...
    ]
  }
]
```

# =========================================