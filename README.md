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
ssacl(sequelize|Model, {
    
});
```

## Add-ons

### ssacl-attributeq-roles

ssacl ships with [ssacl-attribute-roles](https://github.com/mickhansen/ssacl-attribute-roles) so you get role white-/blacklisting for free.

ssacl will automatically initialize the addon on the models you initialize ssacl on, so you simply have to configure your attributes as described on the add-ons github page.

## Sponsored by PumpUp

The work on this project is being sponsored by the great people at [PumpUp](http://pumpup.co/)
