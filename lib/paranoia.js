'use strict';

var assert = require('assert')
  , shimmer = require('shimmer')
  , Sequelize = require('sequelize');

module.exports = function(sequelize, options) {
  options = options || {};

  if (options.paranoia === undefined) {
    options.paranoia = true;
  }

  assert(options.paranoia === true || options.paranoia === false, "paranoia must be true or false");

  if (options.paranoid === false) return;

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

        if (!queryOptions.actor && queryOptions.paranoia !== false) {
          throw new Error('No actor was passed to call and paranoia is enabled: '+sql);
        }

        return original.apply(this, arguments);
      };
    });
    sequelize.$ssaclParanoia = true;
  }
};