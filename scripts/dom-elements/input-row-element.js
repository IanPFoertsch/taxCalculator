function Row(config, parentIdentifier) {
  this.config = config;
  this.parentIdentifier = parentIdentifier;
}

Row.prototype.prepare = function() {
  this.parent = document.querySelector(this.parentIdentifier);

  this.div = document.createElement('Div');
  this.div.className += "table-row";

  this.label = document.createElement('Label');
  this.label.innerText = this.config.label;

  this.div.appendChild(this.label);
  this.parent.appendChild(this.div, this.parent);
};


function InputRowElement(config, parentIdentifier) {
  Row.call(this, config, parentIdentifier);
}

InputRowElement.protoype = Object.create(Row.prototype);

InputRowElement.prototype.prepare = function() {
  Row.prototype.prepare.call(this);

  this.input = document.createElement('Input');

  this.input.type = this.config.type;
  this.input.name = this.config.label;

  this.div.appendChild(this.input);
};


function OutputRow(config, parentIdentifier) {
  Row.call(this, config, parentIdentifier);
}

OutputRow.prototype.prepare = function() {
  Row.prototype.prepare.call(this);

  this.output = document.createElement('div');

  this.output.name = this.config.label;
  this.output.innerHTML = this.config.value;

  this.div.appendChild(this.output);
};

OutputRow.protoype = Object.create(Row.prototype);
