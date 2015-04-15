'use strict';

var ssacl = require('../lib')
  , expect = require('expect.js')
  , sinon = require('sinon')
  , helper = require('./helper');

describe('paranoia', function () {
  describe('enabled', function () {
    it('should throw if no actor on query configured globally', function () {
      var self = this;

      ssacl(this.sequelize, {
        paranoia: true,
        read: {
          attribute: 'id'
        }
      });

      expect(function () {
        this.sequelize.query("SELECT * FROM yolo", {
          actor: undefined
        });
      }.bind(this)).to.throwError('No actor was passed to call and paranoia is enabled');
    });

    it('should throw if actor on query configured globally', function () {
      var self = this
        , stub = sinon.stub(this.sequelize, 'query');

      ssacl(this.sequelize, {
        paranoia: true,
        read: {
          attribute: 'id'
        }
      });

      expect(function () {
        this.sequelize.query("SELECT * FROM yolo", {
          actor: new ssacl.Omnipotent()
        });
      }.bind(this)).not.to.throwError();

      expect(stub.calledOnce).to.equal(true);
    });

    it('should throw if no actor on query configured on Model', function () {
      var self = this
        , Model = this.sequelize.define('Model', {});

      ssacl(Model, {
        paranoia: true,
        read: {
          attribute: 'id'
        }
      });

      expect(function () {
        this.sequelize.query("SELECT * FROM yolo", {
          actor: undefined
        });
      }.bind(this)).to.throwError('No actor was passed to call and paranoia is enabled');
    });

    it('should not throw if actor on query configured on Model', function () {
      var self = this
        , Model = this.sequelize.define('Model', {})
        , stub = sinon.stub(this.sequelize, 'query');

      ssacl(Model, {
        paranoia: true,
        read: {
          attribute: 'id'
        }
      });

      expect(function () {
        this.sequelize.query("SELECT * FROM yolo", {
          actor: new ssacl.Omnipotent()
        });
      }.bind(this)).not.to.throwError();

      expect(stub.calledOnce).to.equal(true);
    });
  });

  describe('disabled', function () {
    it('should not throw if no actor on query configured globally', function () {
      var stub = sinon.stub(this.sequelize, 'query');

      ssacl(this.sequelize, {
        paranoia: false,
        read: {
          attribute: 'id'
        }
      });

      expect(function () {
        this.sequelize.query("SELECT * FROM yolo", {
          actor: undefined
        });
      }.bind(this)).not.to.throwError();
      expect(stub.calledOnce).to.equal(true);
    });

    it('should not throw if no actor on query configured on Model', function () {
      var stub = sinon.stub(this.sequelize, 'query')
        , Model = this.sequelize.define('Model', {});

      ssacl(Model, {
        paranoia: false,
        read: {
          attribute: 'id'
        }
      });

      expect(function () {
        this.sequelize.query("SELECT * FROM yolo", {
          actor: undefined
        });
      }.bind(this)).not.to.throwError();
      expect(stub.calledOnce).to.equal(true);
    });
  });
});