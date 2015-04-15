'use strict';

var assert = require('assert')
  , shimmer = require('shimmer')
  , Sequelize = require('sequelize');

module.exports = function(sequelize, options) {
  options = options || {};

  if (options.paranoia === false) return;

  if (!sequelize.$ssaclParanoia) {
    shimmer.wrap(sequelize, 'query', function (original) {
      return function (sql, callee, queryOptions, replacements) {
        if (arguments.length === 2) {
          if (callee instanceof Sequelize.Model) {
            queryOptions = {};
          } else {
            queryOptions = callee;
            callee = undefined;
          }
        }

        queryOptions = queryOptions || {};

        if (queryOptions.actor === undefined && queryOptions.paranoia !== false) {
          throw new module.exports.error();
        }

        return original.apply(this, arguments);
      };
    });
    sequelize.$ssaclParanoia = true;
  }
};
module.exports.Error = function() {
  var tmp = Error.apply(this, arguments);
  tmp.name = this.name = 'SsaclParanoiaError';

  this.message = tmp.message || 'No actor was passed to call and paranoia is enabled';
  Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
};