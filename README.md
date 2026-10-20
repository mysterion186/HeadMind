# Scanner de Vulnérabilités de Dépendances (CVE / OSV.dev)

Cette application web permet d'auditer rapidement le fichier de dépendances d'un projet (`requirements.txt`) afin de détecter les vulnérabilités connues (CVE / GHSA) avant une mise en production, en s'appuyant sur l'API publique [OSV.dev](https://osv.dev/).


## Fonctionnalités
* Import d'un fichier `.txt` contenant des dépendances Python.  
* Extraction des noms de packages et des informations de versions.
* Interrogation de l'API OSV.dev pour les packages disposant d'une version exploitable.  
* Affichage des vulnérabilités retournées par OSV, avec identifiant, résumé, détail et sévérité lorsqu'elle est disponible.  
* Signalement des erreurs de communication avec l'API.
* Interface React / TypeScript et API Django REST Framework.  
* Environnement de développement lançable avec Docker Compose.  

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
Une suite de tests a été implémentée pour garantir la non-régression et la robustesse du service :  
-  **Test du parser**: Validation de l'extraction des packages et des versions sur des formats standard, gestion des commentaires en fin de ligne et des cas limites (fichiers vides, options spécifiques).  
-  **Tests du Service OSV**: Utilisation de mocks (`unittest.mock`) pour simuler les réponses de l'API externe (cas nominaux, absence de version) ainsi que la gestion des erreurs réseau et des timeouts.
-  **Tests de l'API / Vues**: Tests d'intégration du endpoint d'upload (validation des extensions de fichiers, gestion des erreurs 400 et succès avec mock du service OSV).   

## Périmètre et limites connues
### Contraintes de version dans `requirements.txt`
L'API OSV permet de rechercher des vulnérabilités pour une version précise d'un package. Or, un fichier `requirements.txt` peut exprimer une contrainte plutôt qu'une version installée.  
Exemples :  
Déclaration	Interprétation
requests==2.31.0	Version exacte déclarée : 2.31.0
requests>=2.31.0	Version minimale ; la version réellement installée n'est pas connue à partir de cette seule ligne
requests~=2.31.0	Contrainte compatible ; la version effectivement résolue n'est pas connue
requests	Aucune version précisée

Le résultat d'un scan ne doit pas être interprété comme une garantie de sécurité lorsque la version réellement installée est inconnue.  
Une contrainte `>=2.31.0` ne doit pas être présentée comme si `2.31.0` était nécessairement la version utilisée.  

Dans la version actuelle, le parsing des fichiers de dépendances est volontairement simple et ne couvre pas toute la grammaire de requirements.txt (par exemple, les fichiers inclus avec `-r`, les références directes ou toutes les formes de contraintes). Les lignes non prises en charge doivent être considérées comme une limite de couverture, pas comme la preuve que les dépendances concernées sont sûres.

### Résultats inconnus et erreurs OSV
Un scan réussi sans vulnérabilité trouvée et un scan qui n'a pas pu être effectué sont deux situations différentes.
* Analyse réussie, vulnérabilité trouvée : OSV a retourné une ou plusieurs vulnérabilités pour la version interrogée.
* Analyse réussie, aucune vulnérabilité retournée : OSV n'a retourné aucune vulnérabilité pour la version interrogée.
* Analyse impossible ou incomplète : version inconnue, erreur HTTP ou problème réseau ; le statut de sécurité est alors inconnu.
En cas d'erreur, vulnerable: false ne signifie donc pas que le package est sûr : le champ d'erreur doit également être vérifié. L'interface signale ces erreurs, mais tout consommateur de l'API doit conserver cette distinction.

### Autres limites et pistes d'amélioration
* Ajouter des tests de régression couvrant les différents opérateurs de version, les lignes non prises en charge, les réponses OSV incomplètes et les formats de sévérité.
* Améliorer la validation des fichiers importés, notamment l'encodage, la taille et les syntaxes de dépendances non prises en charge.
* Clarifier dans l'interface les cas où une analyse est incomplète et prévoir un état vide explicite.
* Éviter de renvoyer directement les détails internes d'exceptions inattendues dans les réponses HTTP.
* Pour un déploiement en production, remplacer les paramètres Django de développement par une configuration adaptée à l'environnement : secret externalisé, DEBUG=False, hôtes autorisés, serveur applicatif de production et contrôles de sécurité associés.
* Optimisation des requêtes OSV.dev (Appels asynchrones / Batching)
* Mise en place de cache pour enregistrer les couples packages/version et ne pas refaire de requête

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

### Ce qui a été réalisé
[x] Backend : Endpoint d'upload et de parsing du fichier requirements.txt.  
[x] Backend : Intégration de l'API publique OSV.dev et formatage des vulnérabilités (identifiant, résumé, sévérité, description).  
[x] Backend : Containerisation Docker (Dockerfile + Docker Compose).
[x] Frontend : Interface réactive avec formulaire de téléversement, tableau de résultats clair, filtres combinés (nom, statut, sévérité) et tri.  
[x] Frontend : Vue détaillée d'une vulnérabilité via une fenêtre modale avec liens explicites vers la source OSV.dev.  
[x] Frontend : Containerisation et intégration dans Docker Compose.  


## Exemple d'utilisation

1. Importer un fichier `requirements.txt` (il y a des fichiers dans le dossier `samples/`).
2. Lancer l'analyse.
3. Consulter les dépendances analysées et les vulnérabilités détectées.
4. Filtrer les résultats par nom de package, statut ou sévérité.
5. Ouvrir une vulnérabilité pour consulter ses détails et sa source.

Une dépendance dont la version ne peut pas être déterminée
ou dont l'analyse a échoué doit être signalée comme inconnue,
et non comme sûre.