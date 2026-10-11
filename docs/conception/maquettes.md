# Maquettes et schéma d'enchaînement

Fichier Figma : [Neurao — Wireframes, maquettes et prototype](https://www.figma.com/design/0Zdq81iFLyYNoyTomLXeLm)

## Organisation du fichier

La conception suit l'ordre wireframe → maquette → prototype. Chaque page du site a deux blocs, un pour le bureau (1440 px) et un pour le mobile (390 px), rangés dans l'ordre du parcours d'achat puis du back-office.

| Page Figma                | Contenu                                                                                                                                      |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| 1 — Wireframes            | La structure des 28 pages, en niveaux de gris, avec des annotations qui renvoient aux besoins du cahier des charges (B1 à B23, A1 à A11, §6) |
| 2 — Maquettes             | Les mêmes 28 pages avec l'identité neuraO : 56 écrans                                                                                        |
| 3 — Prototype             | 37 écrans reliés par 200 liens au clic, en trois flux : parcours d'achat bureau, parcours d'achat mobile, back-office                        |
| 4 — Schéma d'enchaînement | Les écrans et les actions qui permettent de passer de l'un à l'autre                                                                         |

Pages couvertes : accueil, catalogue, recherche (avec et sans résultat), fiche produit, le livre, la marque, panier, connexion et inscription, mot de passe oublié, nouveau mot de passe, tunnel de commande en trois étapes, confirmation, profil, commandes du client, détail d'une commande, gabarit des pages légales avec le bandeau de cookies, page 404 ; back-office : connexion, commandes, détail d'une commande, produits, fiche produit, catégories, stock, clients, comptes internes.

## Système de design

| Élément              | Choix                                                                                                                                                                                 |
| -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Couleurs             | 27 variables Figma tirées de la palette de la marque : fond sable `#F7F0E7`, texte `#7E5E4D`, texte fort `#4A3728`, et les familles corail, turquoise, miel, lavande et orange        |
| Typographie          | Outfit seule, pour les titres comme pour le texte                                                                                                                                     |
| Composants           | logo, icônes, boutons (principal, secondaire, sombre), pastille, champ de formulaire, carte produit bureau, carte produit mobile, avatars, en-têtes et pieds de page bureau et mobile |
| Couleur des produits | chaque produit garde la couleur de son sachet : Focus corail, Vital orange, Flora+ turquoise, MgPlus lavande, Oméga-3 et D3 miel                                                      |
| Statuts de commande  | une couleur par statut, identique côté client et back-office : payée (miel), en préparation (lavande), expédiée (turquoise), livrée (turquoise foncé), annulée (corail)               |

## Décisions de conception

| Décision                                                            | Raison                                                                                                                                                                                                                                     |
| ------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Titres en Outfit plutôt qu'en serif italique                        | Lisibilité : la serif italique devenait difficile à lire sur deux lignes et en petite taille. Une seule famille de polices à charger améliore aussi la performance mobile. Quatre polices ont été comparées sur une planche avant ce choix |
| Pied de page en colonnes réparties sur toute la largeur             | La première version laissait un grand vide à droite. Quatre variantes ont été comparées ; la version en colonnes est la plus lisible et la plus attendue sur un site marchand                                                              |
| Carte produit mobile compacte                                       | La première version faisait environ 330 px de haut. La version retenue, environ 250 px, garde toutes les informations (âge, format, prix) ; trois variantes ont été comparées                                                              |
| Catégories par format (gélules, gommes, liquides, poudres)          | Une catégorie par « besoin » serait une allégation de santé ; le format est factuel et donne les quatre catégories demandées par le jeu de données (annexe B)                                                                              |
| Aucune allégation de santé dans les textes                          | Règlement européen 1924/2006 et consigne du tuteur : les textes décrivent la composition, le format, l'âge et la dose                                                                                                                      |
| Tunnel de commande avec un en-tête réduit                           | Le logo et la mention « Paiement sécurisé » seulement, pour limiter les sorties pendant la commande                                                                                                                                        |
| Back-office sans version mobile dédiée au-delà des listes en cartes | C'est un outil de travail sur ordinateur ; il reste utilisable à partir de 320 px comme le demande le §9.2                                                                                                                                 |

## Accessibilité

| Point vérifié                  | Résultat                                                                           |
| ------------------------------ | ---------------------------------------------------------------------------------- |
| Texte `#7E5E4D` sur fond sable | contraste 5,2:1, conforme (seuil 4,5:1)                                            |
| Texte des boutons miel         | `#4A3728` sur `#F9B233` : 6,1:1. Le brun courant `#7E5E4D` n'atteignait que 3,2:1  |
| Texte léger `#A48A7B`          | 2,9:1 sur fond sable : réservé aux bordures, jamais au texte                       |
| Bouton « Ajouter » sur mobile  | 44 × 44 px, taille minimale recommandée pour une cible tactile                     |
| Produit indisponible           | signalé par un texte (« Bientôt de retour »), pas seulement par une couleur grisée |
| Champs en erreur               | message rattaché au champ, en plus de la bordure colorée                           |

## Éléments provisoires

- Les flacons d'Oméga-3 et de D3 n'ont pas encore de photo : leur mascotte (banane, soleil) les remplace.
- Les portraits des experts sont des avatars illustrés.
- La couverture du livre est une création provisoire.

## Exports

Le dossier `maquettes/` contient le schéma d'enchaînement et une sélection d'écrans en bureau et en mobile : accueil, catalogue, fiche produit, panier, paiement, commandes du client, et deux écrans du back-office. Les 56 écrans restent consultables dans le fichier Figma.
