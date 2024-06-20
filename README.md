# OlympicGames

Ce projet est une application Angular conçue pour présenter des informations sur les performances olympiques des pays en termes de médailles gagnées. Il se compose de deux composants principaux qui visualisent les données à travers des graphiques interactifs.

HomeComponent : Ce composant affiche un graphique circulaire illustrant la répartition totale des médailles par pays.

DetailsComponent : Ce composant fournit une vue détaillée des performances olympiques d'un pays spécifique.

En cliquant sur un pays dans le graphique, l'utilisateur est redirigé vers le `DetailsComponent` qui offre des informations plus spécifiques sur ce pays.

# Installation

Suivez ces étapes pour configurer et lancer le projet localement :

1. Installations des dépendances

```bash
npm install
```

2. Démarrage du serveur de développement .

```bash
ng serve
```

3. Exécutez cette commande pour lancer le serveur de développement. Une fois le serveur en marche, ouvrez votre navigateur à l'adresse suivante :

```bash
http://localhost:4200/
```

# Explication du code

### Composants:

#### HomeComponent

Ce composant a pour objectif de récupérer et d'afficher les données relatives aux médailles olympiques. Il initialise un graphique circulaire qui présente une vue d'ensemble des médailles obtenues par chaque pays participant.

#### DetailsComponent

Le `DetailsComponent` est conçu pour offrir une analyse détaillée des performances olympiques d'un pays spécifique.  
Après avoir sélectionné un pays dans le graphique circulaire, des informations détaillées sont affichées. Cela inclut le nom du pays, le nombre total de participations aux Jeux Olympiques, le nombre total de médailles gagnées, et le nombre d'athlètes qui ont représenté le pays.  
Un graphique linéaire présente le nombre de médailles remportées par le pays au fil des différents Jeux Olympiques.
