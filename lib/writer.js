'use strict';

var errors = require('./errors');

module.exports = function(Model, options) {
  var checkActor = function(instance, actionOptions) {
    if (!options.write) return;

    if (actionOptions.paranoia !== false && options.paranoia && actionOptions.actor === undefined) {
      throw new errors.Paranoia();
    }

    var actor = options.actor(actionOptions.actor)
      , writer = instance.get(options.write.attribute, {raw: true});

    if (actor !== writer) {
      throw new errors.WrongActor('Actor is not allowed to update this instance');
    }
  };

  Model.beforeUpdate(function (instance, updateOptions) {
    return checkActor(instance, updateOptions);
  });

  Model.beforeDestroy(function (instance, destroyOptions) {
    return checkActor(instance, destroyOptions);
  });
};