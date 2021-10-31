'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var providers_base = require('./base.js');
var providers_twitch = require('./twitch.js');
var providers_google = require('./google.js');
var providers_twitter = require('./twitter.js');
var providers_facebook = require('./facebook.js');
var providers_oauth2_base = require('./oauth2.base.js');
var providers_oauth2 = require('./oauth2.js');
var providers_reddit = require('./reddit.js');
require('cross-fetch');
require('../helpers.js');



exports.Provider = providers_base.Provider;
exports.TwitchOAuth2Provider = providers_twitch.TwitchOAuth2Provider;
exports.GoogleOAuth2Provider = providers_google.GoogleOAuth2Provider;
exports.TwitterAuthProvider = providers_twitter.TwitterAuthProvider;
exports.FacebookOAuth2Provider = providers_facebook.FacebookOAuth2Provider;
exports.OAuth2BaseProvider = providers_oauth2_base.OAuth2BaseProvider;
exports.OAuth2Provider = providers_oauth2.OAuth2Provider;
exports.RedditOAuth2Provider = providers_reddit.RedditOAuth2Provider;
//# sourceMappingURL=index.js.map
