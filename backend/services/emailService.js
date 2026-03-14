const { Resend } = require('resend');
const { db } = require('../config/firebase');

// Initialize Resend safely
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

const FROM_EMAIL = 'Lichtenberg-Kamer <info@lichtenbergkamer.page>';

const getSubscribers = async () => {
    const snapshot = await db.collection('subscribers').get();
    return snapshot.docs.map(doc => doc.data().email);
};

exports.sendWelcomeEmail = async (email) => {
    try {
        if (!resend) return;

        await resend.emails.send({
            from: FROM_EMAIL,
            to: [email],
            subject: 'Bienvenue chez Lichtenberg-Kamer !',
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px; background-color: #0A0F1C; color: white;">
                    <img src="https://lichtenbergkamer.page/images/logo.png" style="width: 80px; display: block; margin: auto;" />
                    <h2 style="text-align: center; color: #F5C518; text-transform: uppercase;">Merci de votre inscription !</h2>
                    <p style="font-size: 16px; text-align: center;">Vous faites maintenant partie de la famille <strong>Lichtenberg-Kamer e.V.</strong></p>
                    <p style="font-size: 14px; color: #ccc; text-align: center;">Désormais, vous recevrez en exclusivité toutes nos actualités et les horaires de nos prochains matchs.</p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://lichtenbergkamer.page" style="background-color: #1B5BA6; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; text-transform: uppercase;">Visiter le site</a>
                    </div>
                    <p style="font-size: 11px; color: #666; text-align: center;">Vous recevez ce mail car vous vous êtes inscrit à la newsletter sur lichtenbergkamer.page</p>
                </div>
            `
        });
    } catch (error) {
        console.error('Welcome Email Error:', error);
    }
};

exports.sendNewsNotification = async (article) => {
    try {
        if (!resend) return;

        const emails = await getSubscribers();
        if (emails.length === 0) return;

        await resend.emails.send({
            from: FROM_EMAIL,
            to: emails,
            subject: `Nouvel Article : ${article.title}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
                    <img src="https://lichtenbergkamer.page/images/logo.png" style="width: 80px; display: block; margin: auto;" />
                    <h2 style="text-align: center; color: #1B5BA6; text-transform: uppercase;">Nouvelle Actualité !</h2>
                    <p style="font-size: 16px; color: #333;">Bonjour supporter,</p>
                    <p style="font-size: 16px; color: #333;">Un nouvel article vient d'être publié : <strong>${article.title}</strong></p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://lichtenbergkamer.page/news/${article._id}" style="background-color: #F5C518; color: black; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; text-transform: uppercase;">Lire l'article</a>
                    </div>
                    <p style="font-size: 12px; color: #999; text-align: center;">Lichtenberg-Kamer e.V. - Plus qu'un club.</p>
                </div>
            `
        });
    } catch (error) {
        console.error('Email Error:', error);
    }
};

exports.sendMatchNotification = async (match) => {
    try {
        if (!resend) return;

        const emails = await getSubscribers();
        if (emails.length === 0) return;

        await resend.emails.send({
            from: FROM_EMAIL,
            to: emails,
            subject: `Prochain Match : LK vs ${match.opponent}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #1B5BA6; padding: 20px; border-radius: 10px; background-color: #0A0F1C; color: white;">
                    <h2 style="text-align: center; color: #F5C518; text-transform: uppercase;">Match Programmé !</h2>
                    <div style="text-align: center; font-size: 24px; font-weight: bold; margin: 20px 0;">
                        LK vs ${match.opponent}
                    </div>
                    <p style="text-align: center; font-size: 16px;">
                        📅 <strong>${new Date(match.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}</strong><br/>
                        ⏰ <strong>${match.time || 'À confirmer'}</strong><br/>
                        📍 <strong>${match.location}</strong>
                    </p>
                    <div style="text-align: center; margin: 30px 0;">
                        <a href="https://lichtenbergkamer.page/matches" style="background-color: #1B5BA6; color: white; padding: 12px 25px; text-decoration: none; font-weight: bold; border-radius: 5px; text-transform: uppercase;">Plus de détails</a>
                    </div>
                </div>
            `
        });
    } catch (error) {
        console.error('Email Error:', error);
    }
};
