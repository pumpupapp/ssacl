'use strict';

function Omnipotent() {
  // Hacky, Sequelize deep clone will kill instanceof
  this.$omnipotent = true;
}

module.exports = Omnipotent;