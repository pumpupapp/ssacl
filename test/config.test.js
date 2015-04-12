'use strict';

var ssacl = require('../lib')
  , expect = require('expect.js')
  , sinon = require('sinon')
  , Sequelize = require('sequelize')
  , sequelize = new Sequelize(null, null, null, {
      dialect: 'sqlite'
    });

describe('config', function () {
  it('should work on a sequelize instance', function () {
    var User
      , Project
      , spy = sinon.spy(ssacl, 'init')
      , options = {};

    ssacl(sequelize, options);

    User = sequelize.define('User');
    Project = sequelize.define('Project');

    expect(spy.callCount).to.equal(2);

    expect(spy.getCall(0).calledWith(User, options)).to.be.ok();
    expect(spy.getCall(1).calledWith(Project, options)).to.be.ok();

    spy.restore();
  });

  it('should work on a sequelize model', function () {
    var User = sequelize.define('User')
      , spy = sinon.spy(ssacl, 'init')
      , options = {};

    ssacl(User, options);

    expect(spy.callCount).to.equal(1);

    expect(spy.getCall(0).calledWith(User, options)).to.be.ok();

    spy.restore();
  });
});