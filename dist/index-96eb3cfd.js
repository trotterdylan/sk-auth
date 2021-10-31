'use strict';

var providers_base = require('./providers/base.js');
var providers_twitch = require('./providers/twitch.js');
var providers_google = require('./providers/google.js');
var providers_twitter = require('./providers/twitter.js');
var providers_facebook = require('./providers/facebook.js');
var providers_oauth2_base = require('./providers/oauth2.base.js');
var providers_oauth2 = require('./providers/oauth2.js');
var providers_reddit = require('./providers/reddit.js');

var index = /*#__PURE__*/Object.freeze({
	__proto__: null,
	Provider: providers_base.Provider,
	TwitchOAuth2Provider: providers_twitch.TwitchOAuth2Provider,
	GoogleOAuth2Provider: providers_google.GoogleOAuth2Provider,
	TwitterAuthProvider: providers_twitter.TwitterAuthProvider,
	FacebookOAuth2Provider: providers_facebook.FacebookOAuth2Provider,
	OAuth2BaseProvider: providers_oauth2_base.OAuth2BaseProvider,
	OAuth2Provider: providers_oauth2.OAuth2Provider,
	RedditOAuth2Provider: providers_reddit.RedditOAuth2Provider
});

exports.index = index;
//# sourceMappingURL=index-96eb3cfd.js.map
