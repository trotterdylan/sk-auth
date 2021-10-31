interface SignInConfig {
    redirectUrl?: string;
}
export declare function signIn(provider: string, data?: any, config?: SignInConfig): Promise<any>;
export {};
