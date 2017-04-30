function InputListener(config) {
  this.config = config;
}

InputListener.prototype.getInput = function() {
  element = document.getElementsByName(this.config.label)[0];  
  return element.value;
};
