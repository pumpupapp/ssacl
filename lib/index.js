'use strict';

var Sequelize = require('sequelize')
  , ssaclAttributeRoles = require('ssacl-attribute-roles')
  , paranoia = require('./paranoia')
  , reader = require('./reader')
  , assert = require('assert');

module.exports = function(target, options) {
  options = options || {};

  /*
   * Read options
   */
  assert(options.read && options.read.attribute, 'read.attribute must be defined');

  if (options.read.public === undefined) {
    options.read.public = null;
  }
  if (options.read.none === undefined) {
    options.read.none = 0;
  }

  /*
   * Paranoia options
   */
  if (options.paranoia === undefined) {
    options.paranoia = true;
  }
  assert(options.paranoia === true || options.paranoia === false, "paranoia must be true or false");

  if (target instanceof Sequelize.Model) {
    paranoia(target.sequelize, options);

    module.exports.init(target, options);
  } else {
    paranoia(target, options);

    target.afterDefine(function (Model) {
      module.exports.init(Model, options);
    });
  }
};

module.exports.init = function(Model, options) {
  var sequelize = Model.sequelize;

  if (!options.actor) {
    options.actor = function(actor) {
      if (actor instanceof Model.Instance) {
        return actor.get(Model.primaryKeyAttribute, {raw: true});
      }
      return (actor && actor.id) || actor || null;
    };
  }

  ssaclAttributeRoles(Model);
  reader(Model, options);
};

module.exports.Omnipotent = require('./omnipotent');