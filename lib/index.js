'use strict';

var Sequelize = require('sequelize')
  , ssaclAttributeRoles = require('ssacl-attribute-roles')
  , paranoia = require('./paranoia');

module.exports = function(target, options) {
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

  options = options || {};

  ssaclAttributeRoles(Model);
};

module.exports.Omnipotent = require('./omnipotent');