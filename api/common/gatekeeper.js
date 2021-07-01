/* global conf*/
const passport = require('passport');
const request = require('superagent');
const rateLimiter = require('./rate-limit');

module.exports = {
  allowGuest(req, res, next) {
    if (req.headers.authorization) {
      passport.authenticate('bearer')(req, res, next);
    }
    else {
      const sso = conf.sso;
      let url;
      let permissions = [];

      req.user = {
        'profile': {
          'first_name': 'Guest',
        },
        'permissions': permissions,
      };

      url = sso.base_url + '/applications/';
      url += sso.client_id + '/roles/Guest/details/';

      request
        .get(url)
        .query({
          app_secret: sso.client_secret,
        })
        .end(function(err, result) {
          if (!err) {
            permissions = result.body.responseData.data.permissions || [];
            permissions = permissions.map(function(perm) {
              return perm.unique_code;
            });
            req.user.permissions = permissions;
            rateLimiter(req, res, next);
          }
          else {
            next(err);
          }
        });
    }
  },
  ensureAuthenticated(req, res, next) {
    passport.authenticate('bearer')(req, res, next);
  },
};
