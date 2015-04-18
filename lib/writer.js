'use strict';

var errors = require('./errors');

module.exports = function(Model, options) {
  var checkInstanceActor = function(instance, actionOptions) {
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

  var checkModelActor = function(actionOptions) {
    if (!options.write) return;

    if (actionOptions.paranoia !== false && options.paranoia && actionOptions.actor === undefined) {
      throw new errors.Paranoia();
    }

    if (actionOptions.actor !== undefined) {
      actionOptions.where[options.write.attribute] = options.actor(actionOptions.actor);
    }
  };

  Model.beforeUpdate(function (instance, updateOptions) {
    return checkInstanceActor(instance, updateOptions);
  });

  Model.beforeBulkUpdate(function (updateOptions) {
    return checkModelActor(updateOptions);
  });

  Model.beforeDestroy(function (instance, destroyOptions) {
    return checkInstanceActor(instance, destroyOptions);
  });

  Model.beforeBulkDestroy(function (updateOptions) {
    return checkModelActor(updateOptions);
  });
};