'use strict';

var ssacl = require('../lib')
  , chai = require('chai')
  , expect = chai.expect
  , helper = require('./helper')
  , Sequelize = require('sequelize')
  , Promise = helper.Promise;

Promise.longStackTraces();
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

  describe('Model.update', function () {
    beforeEach(function () {
      ssacl(this.Post, {
        write: {
          attribute: 'userId'
        }
      });
    });

    it('should reject update without actor', function () {
      return expect(this.Post.update({
        title: 'Less Awesome Post'
      }, {
        where: {}
      })).be.rejectedWith(ssacl.ParanoiaError);
    });

    it('should filter update to actor', function () {
      return this.Post.update({
        title: 'Less Awesome Post',
      }, {
        where: {},
        actor: this.User.build({
          id: this.user.get('id')+13
        })
      }).bind(this).spread(function (affected) {
        expect(affected).to.equal(0);

        return this.Post.findAll({
          paranoia: false
        }).then(function (posts) {
          expect(posts[0].get('title')).to.equal('Super Awesome Post');
        });
      }).then(function () {
        return this.Post.update({
          title: 'Super Duper Awesome Post',
        }, {
          where: {},
          actor: this.user
        }).bind(this).spread(function (affected) {
          expect(affected).to.equal(1);

          return this.Post.findAll({
            paranoia: false
          }).then(function (posts) {
            expect(posts[0].get('title')).to.equal('Super Duper Awesome Post');
          });
        });
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

    it('should reject destroy without actor', function () {
      return expect(this.post.destroy()).be.rejectedWith(ssacl.ParanoiaError);
    });

    it('should reject destroy with wrong actor', function () {
      return expect(this.post.destroy({
        actor: this.User.build({
          id: this.user.get('id')+13
        })
      })).be.rejectedWith(ssacl.WrongActorError);
    });

    it('should allow destroy when correct actor', function () {
      return this.post.destroy({
        actor: this.user
      });
    });
  });

  describe('Model.destroy', function () {
    beforeEach(function () {
      ssacl(this.Post, {
        write: {
          attribute: 'userId'
        }
      });
    });

    it('should reject destroy without actor', function () {
      return expect(this.Post.destroy({
        where: {}
      })).be.rejectedWith(ssacl.ParanoiaError);
    });

    it('should filter destroy to actor', function () {
      return this.Post.destroy({
        where: {},
        actor: this.User.build({
          id: this.user.get('id')+13
        })
      }).bind(this).then(function (affected) {
        expect(affected).to.equal(0);

        return this.Post.findAll({
          paranoia: false
        }).then(function (posts) {
          expect(posts.length).to.equal(1);
        });
      }).then(function () {
        return this.Post.destroy({
          where: {},
          actor: this.user
        }).bind(this).then(function (affected) {
          expect(affected).to.equal(1);

          return this.Post.findAll({
            paranoia: false
          }).then(function (posts) {
            expect(posts.length).to.equal(0);
          });
        });
      });
    });
  });
});