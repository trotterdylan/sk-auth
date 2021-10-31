'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var providers_oauth2_base = require('./oauth2.base.js');
require('./base.js');

const defaultConfig = {
  id: "twitter"
};
class TwitterAuthProvider extends providers_oauth2_base.OAuth2BaseProvider {
  constructor(config) {
    super({
      ...defaultConfig,
      ...config
    });
  }
  async getRequestToken(auth, host) {
    const endpoint = "https://api.twitter.com/oauth/request_token";
    const data = {
      oauth_callback: encodeURIComponent(this.getCallbackUri(auth, host)),
      oauth_consumer_key: this.config.apiKey
    };
    const res = await fetch(`${endpoint}?${new URLSearchParams(data)}`, { method: "POST" });
    const { oauth_token, oauth_token_secret, oauth_callback_confirmed } = await res.json();
    return {
      oauthToken: oauth_token,
      oauthTokenSecret: oauth_token_secret,
      oauthCallbackConfirmed: oauth_callback_confirmed
    };
  }
  async getAuthorizationUrl({ host }, auth, state, nonce) {
    const endpoint = "https://api.twitter.com/oauth/authorize";
    const { oauthToken } = await this.getRequestToken(auth, host);
    const data = {
      oauth_token: oauthToken
    };
    const url = `${endpoint}?${new URLSearchParams(data)}`;
    return url;
  }
  async getTokens(oauthToken, oauthVerifier) {
    const endpoint = "https://api.twitter.com/oauth/access_token";
    const data = {
      oauth_consumer_key: this.config.apiKey,
      oauth_token: oauthToken,
      oauth_verifier: oauthVerifier
    };
    const res = await fetch(`${endpoint}?${new URLSearchParams(data)}`, { method: "POST" });
    return await res.json();
  }
  async getUserProfile({ oauth_token, oauth_token_secret: _ }) {
    const endpoint = "https://api.twitter.com/1.1/account/verify_credentials.json";
    const res = await fetch(endpoint, { headers: { Authorization: `Bearer ${oauth_token}` } });
    return await res.json();
  }
  async callback({ query, host }, auth) {
    const oauthToken = query.get("oauth_token");
    const oauthVerifier = query.get("oauth_verifier");
    const redirect = this.getStateValue(query, "redirect");
    const tokens = await this.getTokens(oauthToken, oauthVerifier);
    let user = await this.getUserProfile(tokens);
    if (this.config.profile) {
      user = await this.config.profile(user, tokens);
    }
    return [user, redirect ?? this.getUri(auth, "/", host)];
  }
}

exports.TwitterAuthProvider = TwitterAuthProvider;
//# sourceMappingURL=twitter.js.map
