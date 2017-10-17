'use strict';

var paranoia = require('./paranoia')
  , Sequelize = require('sequelize')
  , Omnipotent = require('./omnipotent')
  , Op = Sequelize.Op;

module.exports = function(Model, options) {
  Model.beforeFind(function (findOptions) {
    if (!options.read) return;

    if (findOptions.actor === undefined && Sequelize._cls) {
      findOptions.actor = Sequelize._cls.get('actor');
    }

    if (findOptions.paranoia !== false && options.paranoia && findOptions.actor === undefined) {
      throw new paranoia.Error();
    }

    if (!findOptions.where) {
      findOptions.where = {};
    }

    if (findOptions.actor !== undefined && !(findOptions.actor && findOptions.actor.$omnipotent)) {
      var where = {};
      where[Op.or] = [
        options.actor(findOptions.actor),
        options.read.public
      ];

      if (where[Op.or][0] === where[Op.or][1]) {
        where = where[Op.or][0];
      }

      findOptions.where[options.read.attribute] = where;
    }
  });
};