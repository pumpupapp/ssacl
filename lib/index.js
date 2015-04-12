'use strict';

var Sequelize = require('sequelize')
  , ssaclAttributeRoles = require('ssacl-attribute-roles');

module.exports = function(target, options) {
  if (target instanceof Sequelize.Model) {
    module.exports.init(target, options);
  } else {
    target.afterDefine(function (Model) {
      module.exports.init(Model, options);
    });
  }
};

module.exports.init = function(Model, options) {
  
};