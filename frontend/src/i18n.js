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
            "OFFICIELLE": "OFFICIELLE",
            "Ballon d'Or": "Ballon d'Or",
            "Ballon d'Or LK • Vote Gratuit": "Ballon d'Or LK • Vote Gratuit",
            "BALLON D'OR": "BALLON D'OR",
            "Élisez vos meilleurs joueurs de Lichtenberg-Kamer e.V pour chaque catégorie. Soutenez vos favoris en un clic !": "Élisez vos meilleurs joueurs de Lichtenberg-Kamer e.V pour chaque catégorie. Soutenez vos favoris en un clic !",
            "Catégorie Officielle": "Catégorie Officielle",
            "Votes Ouverts": "Votes Ouverts",
            "Votes Fermés": "Votes Fermés",
            "Votes Enregistrés": "Votes Enregistrés",
            "En Tête": "En Tête",
            "Score actuel": "Score actuel",
            "VOTER POUR": "VOTER POUR",
            "VOTÉ POUR CE CANDIDAT": "VOTÉ POUR CE CANDIDAT",
            "Vote effectué dans cette catégorie": "Vote effectué dans cette catégorie",
            "Votes clôturés": "Votes clôturés",
            "Voir Profil & Partager": "Voir Profil & Partager",
            "Partager": "Partager",
            "Retour au Ballon d'Or LK": "Retour au Ballon d'Or LK",
            "Pourcentage des suffrages": "Pourcentage des suffrages",
            "Présentation & Statistiques": "Présentation & Statistiques",
            "Partagez le lien avec votre communauté": "Partagez le lien avec votre communauté",
            "Copier": "Copier",
            "Copié !": "Copié !"
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
            "OFFICIELLE": "TICKETING",
            "Ballon d'Or": "Ballon d'Or",
            "Ballon d'Or LK • Vote Gratuit": "Ballon d'Or LK • Free Vote",
            "BALLON D'OR": "BALLON D'OR",
            "Élisez vos meilleurs joueurs de Lichtenberg-Kamer e.V pour chaque catégorie. Soutenez vos favoris en un clic !": "Vote for the best Lichtenberg-Kamer e.V players in each category. Support your favorites in one click!",
            "Catégorie Officielle": "Official Category",
            "Votes Ouverts": "Voting Open",
            "Votes Fermés": "Voting Closed",
            "Votes Enregistrés": "Total Votes",
            "En Tête": "Leader",
            "Score actuel": "Current Score",
            "VOTER POUR": "VOTE FOR",
            "VOTÉ POUR CE CANDIDAT": "VOTED FOR THIS CANDIDATE",
            "Vote effectué dans cette catégorie": "Vote completed in this category",
            "Votes clôturés": "Voting closed",
            "Voir Profil & Partager": "View Profile & Share",
            "Partager": "Share",
            "Retour au Ballon d'Or LK": "Back to Ballon d'Or LK",
            "Pourcentage des suffrages": "Percentage of votes",
            "Présentation & Statistiques": "Bio & Statistics",
            "Partagez le lien avec votre communauté": "Share the link with your community",
            "Copier": "Copy",
            "Copié !": "Copied!"
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
            "OFFICIELLE": "TICKETING",
            "Ballon d'Or": "Ballon d'Or",
            "Ballon d'Or LK • Vote Gratuit": "Ballon d'Or LK • Kostenlose Abstimmung",
            "BALLON D'OR": "BALLON D'OR",
            "Élisez vos meilleurs joueurs de Lichtenberg-Kamer e.V pour chaque catégorie. Soutenez vos favoris en un clic !": "Stimmen Sie für die besten Spieler von Lichtenberg-Kamer e.V in jeder Kategorie ab!",
            "Catégorie Officielle": "Offizielle Kategorie",
            "Votes Ouverts": "Abstimmung Geöffnet",
            "Votes Fermés": "Abstimmung Geschlossen",
            "Votes Enregistrés": "Gesamte Stimmen",
            "En Tête": "Führender",
            "Score actuel": "Aktueller Stand",
            "VOTER POUR": "STIMMEN FÜR",
            "VOTÉ POUR CE CANDIDAT": "FÜR DIESEN KANDIDATEN GESTIMMT",
            "Vote effectué dans cette catégorie": "Stimme in dieser Kategorie bereits abgegeben",
            "Votes clôturés": "Abstimmung beendet",
            "Voir Profil & Partager": "Profil ansehen & Teilen",
            "Partager": "Teilen",
            "Retour au Ballon d'Or LK": "Zurück zu Ballon d'Or LK",
            "Pourcentage des suffrages": "Stimmenanteil",
            "Présentation & Statistiques": "Präsentation & Statistiken",
            "Partagez le lien avec votre communauté": "Teilen Sie den Link mit Ihrer Community",
            "Copier": "Kopieren",
            "Copié !": "Kopiert!"
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
