import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
    fr: {
        translation: {
            "Home": "Accueil",
            "Équipe": "Équipe",
            "Matchs": "Matchs",
            "Actualités": "Actualités",
            "Galerie": "Galerie",
            "Contact": "Contact",
            "Tickets": "Tickets",
            "BILLETTERIE": "BILLETTERIE",
            "OFFICIELLE": "OFFICIELLE"
        }
    },
    en: {
        translation: {
            "Home": "Home",
            "Équipe": "Team",
            "Matchs": "Matches",
            "Actualités": "News",
            "Galerie": "Gallery",
            "Contact": "Contact",
            "Tickets": "Tickets",
            "BILLETTERIE": "OFFICIAL",
            "OFFICIELLE": "TICKETING"
        }
    },
    de: {
        translation: {
            "Home": "Startseite",
            "Équipe": "Team",
            "Matchs": "Spiele",
            "Actualités": "Nachrichten",
            "Galerie": "Galerie",
            "Contact": "Kontakt",
            "Tickets": "Tickets",
            "BILLETTERIE": "OFFIZIELLE",
            "OFFICIELLE": "TICKETING"
        }
    }
};

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'fr',
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;
