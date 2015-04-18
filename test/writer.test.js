'use strict';

var ssacl = require('../lib')
  , chai = require('chai')
  , expect = chai.expect
  , helper = require('./helper')
  , Sequelize = require('sequelize')
  , Promise = helper.Promise;

chai.use(require('chai-as-promised'));

describe('writer', function () {
  beforeEach(function () {
    this.Post = this.sequelize.define('Post', {
      title: {
        type: Sequelize.STRING
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      }
    });

    this.User = this.sequelize.define('User', {

    });

    return Promise.join(
      this.Post.sync({force: true}),
      this.User.sync({force: true})
    ).bind(this).then(function () {
      return this.User.create();
    }).then(function (user) {
      this.user = user;

      return this.Post.create({
        title: 'Super Awesome Post',
        userId: this.user.get('id')
      });
    }).then(function (post) {
      this.post = post;
    });
  });

  describe('Instance.update', function () {
    beforeEach(function () {
      ssacl(this.Post, {
        write: {
          attribute: 'userId'
        }
      });
    });

    it('should reject update without actor', function () {
      return expect(this.post.update({
        title: 'Less Awesome Post'
      })).be.rejectedWith(ssacl.ParanoiaError);
    });

    it('should reject update with wrong actor', function () {
      return expect(this.post.update({
        title: 'Less Awesome Post'
      }, {
        actor: this.User.build({
          id: this.user.get('id')+13
        })
      })).be.rejectedWith(ssacl.WrongActorError);
    });

    it('should allow update when correct actor', function () {
      return this.post.update({
        title: 'Super Duper Awesome Post'
      }, {
        actor: this.user
      });
    });
  });

  describe('Instance.destroy', function () {
    beforeEach(function () {
      ssacl(this.Post, {
        write: {
          attribute: 'userId'
        }
      });
    });

    it('should reject update without actor', function () {
      return expect(this.post.destroy()).be.rejectedWith(ssacl.ParanoiaError);
    });

    it('should reject update with wrong actor', function () {
      return expect(this.post.destroy({
        actor: this.User.build({
          id: this.user.get('id')+13
        })
      })).be.rejectedWith(ssacl.WrongActorError);
    });

    it('should allow update when correct actor', function () {
      return this.post.destroy({
        actor: this.user
      });
    });
  });
});