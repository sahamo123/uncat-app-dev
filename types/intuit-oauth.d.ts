declare module 'intuit-oauth' {
    export default class OAuthClient {
        constructor(config: any);
        static scopes: {
            Accounting: string;
            OpenId: string;
            [key: string]: string;
        };
        authorizeUri(options: any): string;
        createToken(url: string): Promise<any>;
        refreshUsingToken(refreshToken: string): Promise<any>;
        makeApiCall(config: any): Promise<any>;
        token: {
            setToken(token: any): void;
        };
        isAccessTokenValid(): boolean;
    }
}
