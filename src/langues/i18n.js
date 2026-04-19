import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector"; // ✅ Import sa a enpòtan

const resources = {
  en: {
    translation: {
      "Home": "Home",
      "Restaurants": "Restaurants",
      "About": "About",
      "Contact": "Contact",
      "Cart": "Cart",
      "Dashboard": "Dashboard",
      "Orders": "Orders",
      "Menu": "Menu",
      "Admin Dashboard": "Admin Dashboard",
      "Login": "Login",
      "Signup": "Sign Up",
      "Profile": "Profile",
      "Logout": "Logout",
      "welcome": "Welcome to our Restaurant",
      "view_menu": "View Menu",
      "Register": "Register",
      "Full name": "Full name",
      "Email": "Email",
      "Password": "Password",
      "Phone": "Phone",
      "Address": "Address",
      "Creating...": "Creating...",
      "Already have an account?": "Already have an account?",
      "Login": "Login",
      "Delicious Food, Delivered To You":"Delicious Food, Delivered To You",
      "Order your favorite meals from local restaurants in minutes.":"Order your favorite meals from local restaurants in minutes.",
      "Order Now":"Order Now"
    }
  },
  fr: {
    translation: {
      "Home": "Accueil",
      "Restaurants": "Restaurants",
      "About": "À propos",
      "Contact": "Contact",
      "Cart": "Panier",
      "Dashboard": "Tableau de bord",
      "Orders": "Commandes",
      "Menu": "Menu",
      "Admin Dashboard": "Administration",
      "Login": "Connexion",
      "Signup": "S'inscrire",
      "Profile": "Profil",
      "Logout": "Déconnexion",
      "welcome": "Bienvenue dans notre Restaurant",
      "view_menu": "Voir le Menu",
      "Register": "S'inscrire",
      "Full name": "Nom complet",
      "Email": "Email",
      "Password": "Mot de passe",
      "Phone": "Téléphone",
      "Address": "Adresse",
      "Creating...": "Création en cours...",
      "Already have an account?": "Vous avez déjà un compte ?",
      "Login": "Connexion",
      "Delicious Food, Delivered To You":"De délicieux plats, livrés chez vous",
      "Order your favorite meals from local restaurants in minutes.":"Commandez vos plats préférés auprès de restaurants locaux en quelques minutes.  ",
      "Order Now":"Commandez maintenant"
    }
  },
  ht: {
    translation: {
      "Home": "Akèy",
      "Restaurants": "Restoran",
      "About": "Sou nou",
      "Contact": "Kontak",
      "Cart": "Panye",
      "Dashboard": "Dashboard",
      "Orders": "Kòmand",
      "Menu": "Menu",
      "Admin Dashboard": "Admin Panel",
      "Login": "Konekte",
      "Signup": "Enskri",
      "Profile": "Profil",
      "Logout": "Dekonekte",
      "welcome": "Byenveni nan Restoran nou an",
      "view_menu": "Gade Menu a",
      "Register": "Enskri",
      "Full name": "Non konplè",
      "Email": "Imèl",
      "Password": "Modpas",
      "Phone": "Telefòn",
      "Address": "Adrès",
      "Creating...": "Kreye...",
      "Already have an account?": "Ou gen deja yon kont ?",
      "Login": "Konekte",
      "Delicious Food, Delivered To You":"Bon manje, livre Lakay Ou",
      "Order your favorite meals from local restaurants in minutes.":"Kòmande manje ou pi renmen nan restoran lokal nan kèk minit.",
      "Order Now":"Kòmande Kounye a"

    }
  }
};

i18n
  .use(LanguageDetector) // ✅ Sa ap pèmèt li sonje lang itilizatè a te chwazi a
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    debug: false, // Mete l sou true si w vle wè log nan konsòl la
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ["localStorage", "cookie", "navigator"],
      caches: ["localStorage"]
    }
  });

export default i18n;