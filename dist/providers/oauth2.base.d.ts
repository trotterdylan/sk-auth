import type { EndpointOutput, ServerRequest } from "@sveltejs/kit/types/endpoint";
import type { Auth } from "../auth";
import type { CallbackResult } from "../types";
import { Provider, ProviderConfig } from "./base";
export interface OAuth2Tokens {
    access_token: string;
    token_type: string;
}
export declare type ProfileCallback<ProfileType = any, TokensType = any, ReturnType = any> = (profile: ProfileType, tokens: TokensType) => ReturnType | Promise<ReturnType>;
export interface OAuth2BaseProviderConfig<ProfileType = any, TokensType = any> extends ProviderConfig {
    profile?: ProfileCallback<ProfileType, TokensType>;
}
export declare abstract class OAuth2BaseProvider<ProfileType, TokensType extends OAuth2Tokens, T extends OAuth2BaseProviderConfig> extends Provider<T> {
    abstract getAuthorizationUrl(request: ServerRequest, auth: Auth, state: string, nonce: string): string | Promise<string>;
    abstract getTokens(code: string, redirectUri: string): TokensType | Promise<TokensType>;
    abstract getUserProfile(tokens: any): ProfileType | Promise<ProfileType>;
    signin(request: ServerRequest, auth: Auth): Promise<EndpointOutput>;
    getStateValue(query: URLSearchParams, name: string): string | undefined;
    callback({ query, host }: ServerRequest, auth: Auth): Promise<CallbackResult>;
}
