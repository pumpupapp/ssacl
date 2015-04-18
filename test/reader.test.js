'use strict';

var ssacl = require('../lib')
  , expect = require('expect.js')
  , sinon = require('sinon')
  , helper = require('./helper')
  , Sequelize = require('sequelize')
  , Promise = helper.Promise;

describe('reader', function () {
  it('should only allow reads on appropriate instances', function () {
    var User = this.sequelize.define('User', {})
      , Post = this.sequelize.define('Post', {
          read: {
            type: Sequelize.INTEGER,
            allowNull: true,
            defaultValue: null
          }
        });

    ssacl(Post, {
      read: {
        attribute: 'read'
      }
    });

    return this.sequelize.sync({force: true}).then(function () {
      return User.create({}, {paranoia: false}).then(function (user) {
        return Promise.join(
          Post.create({
            read: user.get('id')
          }, {
            paranoia: false
          }),
          Post.create({

          }, {
            paranoia: false
          }),
          Post.create({
            read: 0
          }, {
            paranoia: false
          })
        ).then(function (posts) {
          return [user, posts];
        });
      });
    }).spread(function (user, posts) {
      return Promise.join(
        Post.findAll({
          actor: null
        }).then(function (found) {
          expect(found.length).to.equal(1);
          expect(found[0].get('id')).to.equal(posts[1].get('id'));
        }),
        Post.findAll({
          actor: user.get('id')
        }).then(function (found) {
          expect(found.length).to.equal(2);
          expect(found[0].get('id')).to.equal(posts[0].get('id'));
          expect(found[1].get('id')).to.equal(posts[1].get('id'));
        }),
        Post.findAll({
          paranoia: false
        }).then(function (found) {
          expect(found.length).to.equal(3);
        })
      );
    });
  });
});