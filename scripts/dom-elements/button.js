function Button(config, parentIdentifier) {
  DOMElement.call(this, config, parentIdentifier);
}

Button.protoype = Object.create(DOMElement.prototype);

Button.prototype.prepare = function() {
  var parent = document.querySelector(this.parentIdentifier);
  var button = document.createElement('Button');

  button.className += this.config.cssClasses;
  button.innerText = this.config.text;

  button.addEventListener("click", this.config.onClick);
  parent.appendChild(button);
};
