# Simple ACL for Sequelize

[![Build Status](https://travis-ci.org/pumpupapp/ssacl.svg?branch=master)](https://travis-ci.org/pumpupapp/ssacl)

- [Getting Started](#getting-started)
- [Usage](#usage)
- [Paranoia](#paranoia)
- [Options](#options)
- [Add ons](#add-ons)
- [Sponsored by PumpUp](#pumpup)

Effortlessly ensure that only the right actors can read and write objects.

ssacl will ensure that all reads have the appropriate where queries attached and that all writes are checked for appropriate ownership values.

*ssacl needs Sequelize 2.0.7 or higher for all functionality to work*

## Getting Started

```sh
npm install --save ssacl
```

```js
var ssacl = require('ssacl');

ssacl(sequelize|Model, {
  read: {
    attribute: 'reader'
  },
  write: {
    attribute: 'userId'
  }
});
```

*Note*: Either enable ssacl on the entire sequelize instance or specific Models. Mixing is not supported.
*Note*: If using ssacl on specific models rather than on the sequelize instance the `paranoia` option needs to be the same for all models.

## Usage

```js
// will throw an error if the actor for instance does not match the passed actor
instance.update(values, {
  actor: actor
});

// will throw an error if the actor for instance does not match the passed actor
instance.destroy({
  actor: actor
});

// will ammend the where to match the actor
Model.update(values, {
  where: {..}
  actor: actor
});

// will ammend the where to match the actor
Model.destroy({
  where: {..}
  actor: actor
});

// will ammend the where to match the actor
Model.findAll({
  where: {..}
  actor: actor
});

// will ammend the where to match the actor
Model.findOne({
  where: {..}
  actor: actor
});
```

### CLS

Passing actor to all calls can be cumbersome and error-prone so ssacl also supports passing the actor with [CLS](https://github.com/othiym23/node-continuation-local-storage).

```js
var cls = require('continuation-local-storage')
  , ns = cls.createNamespace('mynamespace');

ssacl(sequelize|Model, {
  cls: ns
});

// ssacl will look for the actor property in the name

ns.run(function () {
  ns.set('actor', 2);

  // both calls will automatically be scoped without explicitely setting actor
  return Model.findAll().then(function () {
    return Model.destroy();
  });
});
```

*Note that this will apply CLS to Sequelize, so if using CLS with Sequelize, make sure it's the same namespace*

## Paranoia

By default ssacl will have paranoia enabled (_disable with `{paranoia: false}` globally, or per call_).
With Paranoia enabled any query executed without an actor will result in an error.
To perform actions as god/root use `new ssacl.Omnipotent()` as a placeholder actor that allows everything.

Note: `null` or any value matching the `public` value of `read` is also a valid read actor.

## Options

### ssacl

- `paranoia` `true|false` Toggle paranoia mode, default: `true`
- `actor` `function` Takes a function that parses an actor into a queryable primitive. Default function will take primary key value from a sequelize instance or return the passed input.
- `read` `object` Defines the options for read restriction
- `read.attribute` `string` The attribute/field to store allowed reader in
- `read.public` Value for public read, default: `null`
- `read.none` Value for no reads, default: `0`
- `write` `object` Defines the options for write restriction
- `write.attribute` `string` The attribute/field to store allowed writeer in
- `write.none` Value for no writes, default: `0`

### calls

- `actor` `null|primitive|object|instance|Omnipotent` The actor for this call, default: `null`
- `paranoia` `true|false` Toggle paranoia mode for this call default: `true`

## Add-ons

### ssacl-attributeq-roles

ssacl ships with [ssacl-attribute-roles](https://github.com/mickhansen/ssacl-attribute-roles) so you get role white-/blacklisting for free.

ssacl will automatically initialize the addon on the models you initialize ssacl on, so you simply have to configure your attributes as described on the add-ons github page.

### koa-ssacl

[koa-ssacl](https://github.com/mickhansen/koa-ssacl) makes actor passing trivial by supporting cls with middleware.

## Sponsored by PumpUp

The work on this project is being sponsored by the great people at [PumpUp](http://pumpup.co/)
