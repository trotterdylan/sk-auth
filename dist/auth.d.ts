import type { GetSession, RequestHandler } from "@sveltejs/kit";
import type { EndpointOutput, ServerRequest } from "@sveltejs/kit/types/endpoint";
import type { Headers } from "@sveltejs/kit/types/helper";
import type { JWT, Session } from "./interfaces";
import type { Provider } from "./providers";
interface AuthConfig {
    providers: Provider[];
    callbacks?: AuthCallbacks;
    jwtSecret?: string;
    jwtExpiresIn?: string | number;
    host?: string;
    basePath?: string;
}
interface AuthCallbacks {
    signIn?: () => boolean | Promise<boolean>;
    jwt?: (token: JWT, profile?: any) => JWT | Promise<JWT>;
    session?: (token: JWT, session: Session) => Session | Promise<Session>;
    redirect?: (url: string) => string | Promise<string>;
}
export declare class Auth {
    private readonly config?;
    constructor(config?: AuthConfig | undefined);
    get basePath(): string;
    getJwtSecret(): string;
    getToken(headers: Headers): Promise<JWT | null>;
    getBaseUrl(host?: string): string;
    getPath(path: string): string;
    getUrl(path: string, host?: string): string;
    setToken(headers: Headers, newToken: JWT | any): any;
    signToken(token: JWT): string;
    getRedirectUrl(host: string, redirectUrl?: string): Promise<string>;
    handleProviderCallback(request: ServerRequest, provider: Provider): Promise<EndpointOutput>;
    handleEndpoint(request: ServerRequest): Promise<EndpointOutput>;
    get: RequestHandler;
    post: RequestHandler;
    getSession: GetSession;
}
export {};
