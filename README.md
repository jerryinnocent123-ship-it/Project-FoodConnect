<<<<<<< HEAD
broh wap fe dashBoard restaurant

ou pa gen dwa modifye anyen nan lot compozan yo
wap travay nan FoodConnect/src/components/resto

wap ret nan sa selman lew finn wap push sou git hub mwen map pull m verifye,modifye epi map metel nan branch dev 


=======



#  Project FoodConnect

**FoodConnect** se yon aplikasyon web modèn ki pèmèt itilizatè jwenn, eksplore epi kominike ak restoran lokal fasilman. Li fèt pou amelyore koneksyon ant kliyan ak restoran atravè yon entèfas rapid, senp, epi entèaktif.

---
##  Fonctionnalités principales

*  **Authentification** (inscription / connexion) avèk Supabase
*  **Gestion des rôles** :

  * Utilisateur → ka wè restoran yo
  * Restaurant → gen aksè ak dashboard pou jere meni ak profil
*  **Liste restaurants** ak detay (zone, localisation, etc.)
*  **Localisation restaurants** (lat/lng) pou entegrasyon map
*  **Multilangue (i18n)** → Anglais, Français, Créole
*  **Interface rapide et moderne** gras à Tailwind CSS & UI libraries
*  **Composants réutilisables** (Navbar, Cards, Forms, etc.)

---

## Technologies utilisées
*  React.js
*  Tailwind CSS
*  i18next (i18n)
*  Supabase (Auth, Database, API)
*  AI

## Utilisation AI
* AI a jouer un role important dans le projet en corrigeant les bugs, pour ne citez que ceci.
* 50% AI


---

## Structure du projet

FoodConnect/
|-Src\
|-Components\
            |-Client
            |-Admin
            |-Resto
|-Langues
|-Layouts
|-Pages\
       |-Client
        |-Admin
        |-Resto     
|-Services

---

##  Installation & utilisation

### 1. Cloner le projet

bash
git clone https://github.com/ton-repo/Project-FoodConnect.git
cd Project-FoodConnect

---

### 2. Installer les dépendances

bash / Cmd
npm install


---

### 3. Configurer les variables d’environnement

Créer un fichier `.env` à la racine :

.env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key

siw vle itilize menm .env lan, kontakte Access Group 

---

### 4. Lancer le projet

bash / Cmd
npm run dev


 L’application sera accessible sur :

 
http://localhost:5173
 

---

## Comment utiliser l’application

### Utilisateur

* Créer un compte / se connecter
* Parcourir les restaurants
* Voir leur localisation et informations

###  Restaurant

* Se connecter
* Accéder au dashboard
* Gérer profil et menus

---

## Internationalisation

Le projet utilise **i18n** pour supporter plusieurs langues :

* 🇺🇸 English
* 🇫🇷 Français
* 🇭🇹 Créole

 Langue configurable dynamiquement dans l’interface.

---

##  Base de données

La base de données est gérée via Supabase :

* Table `restaurants`
* Colonnes : `name`, `zone`, `lat`, `lng`, etc.
* Support des requêtes API en temps réel

---

##  Sécurité 

* Authentification sécurisée avec Supabase
* Gestion des accès via rôles
* Row Level Security (RLS) recommandé (pas Appliquer dans le projet)

---

##  Objectif du projet

Créer une plateforme simple, rapide et évolutive pour :

* connecter utilisateurs et restaurants
* faciliter la découverte locale
* offrir une expérience moderne

---

##  Améliorations futures

*  Intégration Google Maps / Leaflet
*  Recherche “restaurants proches de moi”
*  Paiement en ligne (MonCash, etc.)
*  Système d’avis et notes
*  Suivi de commandes
*  Modification Menu (acess Restaurant and Admin)

---

##  Auteur

Acces Group :
* INNOCENT Jerry | jerryinnocent123@gmail.com

-Lumenes lyse A. | lysalumenes17@gma 
-MONDESIR Lea Jennifer | Mleajennifer@gmail
-Conventon | convengtonvilbrun@gmail.com


---

##  Licence

Projet open-source pour apprentissage et amélioration continue.
>>>>>>> dev
