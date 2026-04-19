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
      "view_menu": "View Menu"
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
      "view_menu": "Voir le Menu"
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
      "view_menu": "Gade Menu a"
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