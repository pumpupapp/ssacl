'use strict';

var util = require('util');

function ParanoiaError() {
  var tmp = Error.apply(this, arguments);
  tmp.name = this.name = 'SsaclParanoiaError';

  this.message = tmp.message || 'No actor was passed to call and paranoia is enabled';
  Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
}
util.inherits(ParanoiaError, Error);

function WrongActorError() {
  var tmp = Error.apply(this, arguments);
  tmp.name = this.name = 'SsaclWrongActorError';

  this.message = tmp.message || 'Wrong actor for call';
  Error.captureStackTrace && Error.captureStackTrace(this, this.constructor);
}
util.inherits(WrongActorError, Error);

module.exports = {
  Paranoia: ParanoiaError,
  WrongActor: WrongActorError
};