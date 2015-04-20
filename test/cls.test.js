'use strict';

var ssacl = require('../lib')
  , chai = require('chai')
  , expect = chai.expect
  , sinon = require('sinon')
  , helper = require('./helper')
  , Sequelize = require('sequelize')
  , Promise = helper.Promise
  , cls = require('continuation-local-storage');

chai.use(require('chai-as-promised'));

describe('cls', function () {
  beforeEach(function () {
    this.namespace = cls.createNamespace('ssacl');
  });

  it('should work with instance.update', function () {
    var Post = this.sequelize.define('Post', {
      title: Sequelize.STRING,
      userId: Sequelize.INTEGER
    });

    ssacl(Post, {
      write: {
        attribute: 'userId'
      },
      cls: this.namespace
    });

    return Post.sync({force: true}).bind(this).then(this.namespace.bind(function () {
      return Post.create({
        title: 'A',
        userId: 2
      }).bind(this).then(function (post) {
        this.namespace.set('actor', 1);

        return expect(post.update({
          title: 'B'
        })).be.rejectedWith(ssacl.WrongActorError);
      });
    }));
  });

  it('should work with instance.destroy', function () {
    var Post = this.sequelize.define('Post', {
      title: Sequelize.STRING,
      userId: Sequelize.INTEGER
    });

    ssacl(Post, {
      write: {
        attribute: 'userId'
      },
      cls: this.namespace
    });

    return Post.sync({force: true}).bind(this).then(this.namespace.bind(function () {
      return Post.create({
        title: 'A',
        userId: 2
      }).bind(this).then(function (post) {
        this.namespace.set('actor', 1);

        return expect(post.destroy()).be.rejectedWith(ssacl.WrongActorError);
      });
    }));
  });

  it('should work with Model.findAll', function () {
    var Post = this.sequelize.define('Post', {
      userId: Sequelize.INTEGER
    });

    ssacl(Post, {
      read: {
        attribute: 'userId'
      },
      cls: this.namespace
    });


    return Post.sync({force: true}).bind(this).then(this.namespace.bind(function () {
      return Promise.join(
        Post.create({
          userId: 1
        }),
        Post.create({
          userId: 2
        })
      ).bind(this).then(function () {
        this.namespace.set('actor', 1);

        return Post.findAll().then(function (posts) {
          expect(posts.length).to.equal(1);
        });
      });
    }));
  });

  it('should work with Model.update', function () {
    var Post = this.sequelize.define('Post', {
      title: Sequelize.STRING,
      userId: Sequelize.INTEGER
    });

    ssacl(Post, {
      write: {
        attribute: 'userId'
      },
      cls: this.namespace
    });


    return Post.sync({force: true}).bind(this).then(this.namespace.bind(function () {
      return Promise.join(
        Post.create({
          title: 'A',
          userId: 1
        }),
        Post.create({
          title: 'A',
          userId: 2
        })
      ).bind(this).then(function () {
        this.namespace.set('actor', 1);

        return Post.update({
          title: 'B',
        }, {
          where: {
            title: 'A'
          }
        }).spread(function (affected) {
          expect(affected).to.equal(1);
        });
      });
    }));
  });

  it('should work with Model.destroy', function () {
    var Post = this.sequelize.define('Post', {
      title: Sequelize.STRING,
      userId: Sequelize.INTEGER
    });

    ssacl(Post, {
      write: {
        attribute: 'userId'
      },
      cls: this.namespace
    });


    return Post.sync({force: true}).bind(this).then(this.namespace.bind(function () {
      return Promise.join(
        Post.create({
          title: 'A',
          userId: 1
        }),
        Post.create({
          title: 'A',
          userId: 2
        })
      ).bind(this).then(function () {
        this.namespace.set('actor', 1);

        return Post.destroy({
          where: {
            title: 'A'
          }
        }).then(function (affected) {
          expect(affected).to.equal(1);
        });
      });
    }));
  });
});