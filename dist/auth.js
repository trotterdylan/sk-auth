'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var cookie = require('cookie');
var jsonwebtoken = require('jsonwebtoken');
var path = require('./path.js');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return e[k];
                    }
                });
            }
        });
    }
    n['default'] = e;
    return Object.freeze(n);
}

var cookie__default = /*#__PURE__*/_interopDefaultLegacy(cookie);
var jsonwebtoken__namespace = /*#__PURE__*/_interopNamespace(jsonwebtoken);

class Auth {
  constructor(config) {
    this.config = config;
    this.get = async (request) => {
      const { path } = request;
      if (path === this.getPath("csrf")) {
        return { body: "1234" };
      } else if (path === this.getPath("session")) {
        const session = await this.getSession(request);
        return {
          body: {
            session
          }
        };
      }
      return await this.handleEndpoint(request);
    };
    this.post = async (request) => {
      return await this.handleEndpoint(request);
    };
    this.getSession = async ({ headers }) => {
      const token = await this.getToken(headers);
      if (token) {
        if (this.config?.callbacks?.session) {
          return await this.config.callbacks.session(token, { user: token.user });
        }
        return { user: token.user };
      }
      return {};
    };
  }
  get basePath() {
    return this.config?.basePath ?? "/api/auth";
  }
  getJwtSecret() {
    if (this.config?.jwtSecret) {
      return this.config?.jwtSecret;
    }
    if (this.config?.providers?.length) {
      const provs = this.config?.providers?.map((provider) => provider.id).join("+");
      return Buffer.from(provs).toString("base64");
    }
    return "svelte_auth_secret";
  }
  async getToken(headers) {
    if (!headers.cookie) {
      return null;
    }
    const cookies = cookie__default['default'].parse(headers.cookie);
    if (!cookies.svelteauthjwt) {
      return null;
    }
    let token;
    try {
      token = jsonwebtoken__namespace.verify(cookies.svelteauthjwt, this.getJwtSecret()) || {};
    } catch {
      return null;
    }
    if (this.config?.callbacks?.jwt) {
      token = await this.config.callbacks.jwt(token);
    }
    return token;
  }
  getBaseUrl(host) {
    return this.config?.host ?? `http://${host}`;
  }
  getPath(path$1) {
    const pathname = path.join([this.basePath, path$1]);
    return pathname;
  }
  getUrl(path, host) {
    const pathname = this.getPath(path);
    return new URL(pathname, this.getBaseUrl(host)).href;
  }
  setToken(headers, newToken) {
    const originalToken = this.getToken(headers);
    return {
      ...originalToken ?? {},
      ...newToken
    };
  }
  signToken(token) {
    const opts = !token.exp ? {
      expiresIn: this.config?.jwtExpiresIn ?? "30d"
    } : {};
    const jwt = jsonwebtoken__namespace.sign(token, this.getJwtSecret(), opts);
    return jwt;
  }
  async getRedirectUrl(host, redirectUrl) {
    let redirect = redirectUrl || this.getBaseUrl(host);
    if (this.config?.callbacks?.redirect) {
      redirect = await this.config.callbacks.redirect(redirect);
    }
    return redirect;
  }
  async handleProviderCallback(request, provider) {
    const { headers, host } = request;
    const [profile, redirectUrl] = await provider.callback(request, this);
    let token = await this.getToken(headers) ?? { user: {} };
    if (this.config?.callbacks?.jwt) {
      token = await this.config.callbacks.jwt(token, profile);
    } else {
      token = this.setToken(headers, { user: profile });
    }
    const jwt = this.signToken(token);
    const redirect = await this.getRedirectUrl(host, redirectUrl ?? void 0);
    return {
      status: 302,
      headers: {
        "set-cookie": `svelteauthjwt=${jwt}; Path=/; HttpOnly`,
        Location: redirect
      }
    };
  }
  async handleEndpoint(request) {
    const { path: path$1, headers, method, host } = request;
    if (path$1 === this.getPath("signout")) {
      const token = this.setToken(headers, {});
      const jwt = this.signToken(token);
      if (method === "POST") {
        return {
          headers: {
            "set-cookie": `svelteauthjwt=${jwt}; Path=/; HttpOnly`
          },
          body: {
            signout: true
          }
        };
      }
      const redirect = await this.getRedirectUrl(host);
      return {
        status: 302,
        headers: {
          "set-cookie": `svelteauthjwt=${jwt}; Path=/; HttpOnly`,
          Location: redirect
        }
      };
    }
    const regex = new RegExp(path.join([this.basePath, `(?<method>signin|callback)/(?<provider>\\w+)`]));
    const match = path$1.match(regex);
    if (match && match.groups) {
      const provider = this.config?.providers?.find((provider2) => provider2.id === match.groups.provider);
      if (provider) {
        if (match.groups.method === "signin") {
          return await provider.signin(request, this);
        } else {
          return await this.handleProviderCallback(request, provider);
        }
      }
    }
    return {
      status: 404,
      body: "Not found."
    };
  }
}

exports.Auth = Auth;
//# sourceMappingURL=auth.js.map
