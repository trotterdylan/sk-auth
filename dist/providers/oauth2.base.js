'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var providers_base = require('./base.js');

class OAuth2BaseProvider extends providers_base.Provider {
  async signin(request, auth) {
    const { method, host, query } = request;
    const state = [`redirect=${query.get("redirect") ?? this.getUri(auth, "/", host)}`].join(",");
    const base64State = Buffer.from(state).toString("base64");
    const nonce = Math.round(Math.random() * 1e3).toString();
    const url = await this.getAuthorizationUrl(request, auth, base64State, nonce);
    if (method === "POST") {
      return {
        body: {
          redirect: url
        }
      };
    }
    return {
      status: 302,
      headers: {
        Location: url
      }
    };
  }
  getStateValue(query, name) {
    if (query.get("state")) {
      const state = Buffer.from(query.get("state"), "base64").toString();
      return state.split(",").find((state2) => state2.startsWith(`${name}=`))?.replace(`${name}=`, "");
    }
  }
  async callback({ query, host }, auth) {
    const code = query.get("code");
    const redirect = this.getStateValue(query, "redirect");
    const tokens = await this.getTokens(code, this.getCallbackUri(auth, host));
    let user = await this.getUserProfile(tokens);
    if (this.config.profile) {
      user = await this.config.profile(user, tokens);
    }
    return [user, redirect ?? this.getUri(auth, "/", host)];
  }
}

exports.OAuth2BaseProvider = OAuth2BaseProvider;
//# sourceMappingURL=oauth2.base.js.map
