function InputListener(config) {
  this.config = config;
}

InputListener.prototype.getInput = function() {
  var element = document.getElementsByName(this.config.label)[0];
  return element.value;
};

InputListener.prototype.outputLabel = function() {
  return this.config.output;
};

function NumericInputListener(config) {
  InputListener.call(this, config);
}

NumericInputListener.prototype = Object.create(InputListener.prototype);

NumericInputListener.prototype.getInput = function() {
  var value = InputListener.prototype.getInput.call(this);
  return parseInt(value);
};
