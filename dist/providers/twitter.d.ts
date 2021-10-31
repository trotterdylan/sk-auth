import type { ServerRequest } from "@sveltejs/kit/types/endpoint";
import type { Auth } from "../auth";
import type { CallbackResult } from "../types";
import { OAuth2BaseProvider, OAuth2BaseProviderConfig } from "./oauth2.base";
interface TwitterAuthProviderConfig extends OAuth2BaseProviderConfig {
    apiKey: string;
    apiSecret: string;
}
export declare class TwitterAuthProvider extends OAuth2BaseProvider<any, any, TwitterAuthProviderConfig> {
    constructor(config: TwitterAuthProviderConfig);
    getRequestToken(auth: Auth, host?: string): Promise<{
        oauthToken: any;
        oauthTokenSecret: any;
        oauthCallbackConfirmed: any;
    }>;
    getAuthorizationUrl({ host }: ServerRequest, auth: Auth, state: string, nonce: string): Promise<string>;
    getTokens(oauthToken: string, oauthVerifier: string): Promise<any>;
    getUserProfile({ oauth_token, oauth_token_secret: _ }: any): Promise<any>;
    callback({ query, host }: ServerRequest, auth: Auth): Promise<CallbackResult>;
}
export {};
