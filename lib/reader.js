'use strict';

var paranoia = require('./paranoia');

module.exports = function(Model, options) {
  Model.beforeFind(function (findOptions) {
    if (!options.read) return;

    if (findOptions.paranoia !== false && options.paranoia && findOptions.actor === undefined) {
      throw new paranoia.Error();
    }

    if (!findOptions.where) {
      findOptions.where = {};
    }

    if (findOptions.actor !== undefined) {
      var where = {
        $or: [
          options.actor(findOptions.actor),
          options.read.public
        ]
      };

      if (where.$or[0] === where.$or[1]) {
        where = where.$or[0];
      }

      findOptions.where[options.read.attribute] = where;
    }
  });
};