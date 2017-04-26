function DOMElement(config, parentIdentifier) {
  this.config = config;
  this.parentIdentifier = parentIdentifier;
  this.identifier = '.' + config.cssClasses;
}
