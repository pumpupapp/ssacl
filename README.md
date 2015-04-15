# Simple ACL for Sequelize

[![Build Status](https://travis-ci.org/mickhansen/ssacl.svg?branch=master)](https://travis-ci.org/mickhansen/ssacl)

- [Getting Started](#getting-started)
- [Add ons](#add-ons)
- [Sponsored by PumpUp](#pumpup)

Effortlessly ensure that only the right actors can read and write objects.

## Getting Started

```sh
npm install --save ssacl
```

```js
var ssacl = require('ssacl');

ssacl(sequelize|Model, {
  paranoia: true // default: true
});
```

Note: Either enable ssacl on the entire sequelize instance or specific Models. Mixing is not supported.
Note: If using ssacl on specific models rather than on the sequelize instance the `paranoia` global option needs to be the same for all models.

## Paranoia

By default ssacl will have paranoia enabled (_disable with `{paranoia: false}` globally, or per call_).
With Paranoia enabled any query executed without an actor will result in an error.
To perform actions as god/root use `new ssacl.Omnipotent()` as a placeholder actor that allows everything.

## Options

### ssacl

- `paranoia` `true|false` Toggle paranoia mode, default: `true`

### calls

- `actor` `object|instance|Omnipotent` The actor for this call, default: `null`
- `paranoia` `true|false` Toggle paranoia mode for this call default: `true`

## Add-ons

### ssacl-attributeq-roles

ssacl ships with [ssacl-attribute-roles](https://github.com/mickhansen/ssacl-attribute-roles) so you get role white-/blacklisting for free.

ssacl will automatically initialize the addon on the models you initialize ssacl on, so you simply have to configure your attributes as described on the add-ons github page.

## Sponsored by PumpUp

The work on this project is being sponsored by the great people at [PumpUp](http://pumpup.co/)
