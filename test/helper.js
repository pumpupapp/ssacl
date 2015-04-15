'use strict';

var Sequelize = require('sequelize')
  , Helper = {};

beforeEach(function () {
  this.sequelize = new Sequelize(null, null, null, {
    dialect: 'sqlite'
  });
});

Helper.Promise = Sequelize.Promise;

module.exports = Helper;