import OAuthClient from 'intuit-oauth';

export const getQBOClient = () => {
    return new OAuthClient({
        clientId: process.env.QBO_CLIENT_ID,
        clientSecret: process.env.QBO_CLIENT_SECRET,
        environment: process.env.QBO_ENVIRONMENT || 'sandbox',
        redirectUri: process.env.QBO_REDIRECT_URI,
    });
};
