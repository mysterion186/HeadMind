# Scanner de Vulnérabilités de Dépendances (CVE / OSV.dev)

Cette application web permet d'auditer rapidement le fichier de dépendances d'un projet (`requirements.txt`) afin de détecter les vulnérabilités connues (CVE / GHSA) avant une mise en production, en s'appuyant sur l'API publique [OSV.dev](https://osv.dev/).

---

## Instructions d'installation et de lancement


Afin d'assurer la portabilité et de faciliter l'évaluation, l'application est entièrement containerisée.

1. **Prérequis** : Avoir [Docker](https://www.docker.com/) et Docker Compose installés.
2. **Lancer l'application** : À la racine du projet, exécutez :
   ```bash
   docker compose up --build
   ```
Accès aux services :

Frontend (React) : http://localhost:5173

Backend API (Django) : http://localhost:8000/api/upload/

## Tests (Backend)
Une suite de tests complète a été implémentée pour garantir la non-régression et la robustesse du service :  
-  **Test du parser**: Validation de l'extraction des packages et des versions sur des formats standard, gestion des commentaires en fin de ligne et des cas limites (fichiers vides, options spécifiques).  
-  **Tests du Service OSV**: Utilisation de mocks (`unittest.mock`) pour simuler les réponses de l'API externe (cas nominaux, absence de version) ainsi que la gestion des erreurs réseau et des timeouts.
-  **Tests de l'API / Vues**: Tests d'intégration du endpoint d'upload (validation des extensions de fichiers, gestion des erreurs 400 et succès avec mock du service OSV).   

## Choix techniques et justifications
Backend : Python (Django & Django REST Framework)  
**Maîtrise & Fiabilité** : Bien que FastAPI soit fréquemment suggéré pour ce type de micro-service, j'ai délibérément fait le choix de Django avec Django REST Framework (DRF). Étant le framework Python que je maîtrise le plus en profondeur, ce choix pragmatique garantit une maîtrise totale de la chaîne de valeur, une gestion propre de l'architecture des modules et une fiabilité maximale lors des échanges techniques.  
**Architecture modulaire** : La logique métier a été isolée dans des services dédiés (scanner/services/parser.py et scanner/services/osv.py) afin de séparer la couche d'exposition API (vues DRF) du traitement des fichiers et de l'intégration réseau avec l'API OSV.dev.
**Parsing pragmatique** : Implémentation d'un service léger basé sur des expressions régulières pour analyser le format requirements.txt et en extraire le nom du package, le type d'opérateur ainsi que la version cible.

Frontend : React + TypeScript + Vite  
**Sécurité du typage (TypeScript)** : Garantie d'une excellente rigueur sur les contrats d'interface (structures de données pour les packages et les objets de vulnérabilité OSV).  
**Vite** : Choix d'un bundler moderne offrant un temps de démarrage quasi instantané et une expérience de développement fluide.  
**Composants atomiques** : Découpage propre des composants UI (FileUpload, SearchBar, ResultsTable, VulnModal, ErrorAlert) favorisant la réutilisabilité et la lisibilité du code.  
**Expérience Utilisateur (UX)** : Implémentation d'une gestion complète des états (chargement, erreurs réseau, absence de résultat), filtres dynamiques (recherche textuelle, filtrage par niveau de sévérité ou par état de sécurité) et modale de détail.   
Lancement des tests:
```bash
docker compose run backend python manage.py test scanner
``` 

## Bilan du projet, limites et perspectives d'amélioration
Dans le cadre du temps imparti pour ce test (4 à 6 heures), la priorité a été donnée à la livraison d'un périmètre fonctionnel complet, stable et propre.

### Ce qui a été réalisé
[x] Backend : Endpoint d'upload et de parsing du fichier requirements.txt.  
[x] Backend : Intégration de l'API publique OSV.dev et formatage des vulnérabilités (identifiant, résumé, sévérité, description).  
[x] Backend : Containerisation Docker (Dockerfile + Docker Compose).
[x] Frontend : Interface réactive avec formulaire de téléversement, tableau de résultats clair, filtres combinés (nom, statut, sévérité) et tri.  
[x] Frontend : Vue détaillée d'une vulnérabilité via une fenêtre modale avec liens explicites vers la source OSV.dev.  
[x] Frontend : Containerisation et intégration dans Docker Compose.  


### Limites identifiées & Axes d'amélioration (Vision Tech Lead)
Avec davantage de temps ou pour un passage en production, voici les évolutions majeures qui auraient été apportées :  
* Optimisation des requêtes OSV.dev (Appels asynchrones / Batching) :
* Constat actuel : L'API backend interroge actuellement OSV.dev de manière séquentielle package par package. Sur un fichier contenant un grand nombre de dépendances, la latence cumulée des requêtes HTTP peut rallonger le temps de réponse global.  
* Piste d'amélioration : Migration vers des requêtes asynchrones avec httpx / asyncio ou exploitation poussée du mode batch (/v1/querybatch) couplée à un mécanisme de requêtes secondaires pour les détails, ou encore mise en place de streaming HTTP (Server-Sent Events) pour restituer les résultats au fil de l'eau.

#### Stratégie de Cache :
Intégration d'une couche de mise en cache (Redis ou cache en mémoire Django) pour stocker le statut des couples package:version déjà interrogés récemment, réduisant ainsi drastiquement la dépendance à l'API distante et économisant de la bande passante.  

