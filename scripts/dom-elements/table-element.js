function TableElement(config, parentIdentifier) {
  this.config = config;
  this.parentIdentifier = parentIdentifier;
  this.identifier = '.' + config.cssClasses;

  this.titleRow = new TitleRowElement(config.titleRow, this.identifier);
}

TableElement.prototype.prepare = function() {
  var parent = document.querySelector(this.parentIdentifier);
  var child = document.createElement("Table");

  child.className += this.config.cssClasses;
  parent.appendChild(child);

  this.prepareChildren();
};


TableElement.prototype.prepareChildren = function() {
  this.titleRow.prepare();

  _.each(this.rows, function(row) {
    row.prepare();
  });
};

function InputTableElement(config, parentIdentifier) {
  TableElement.call(this, config, parentIdentifier);
  var self = this;

  this.rows = _.map(config.rows, function(row) {
    return new InputRowElement(row, self.identifier);
  });
}

InputTableElement.prototype = Object.create(TableElement.prototype);


function OutputTableElement(config, parentIdentifier) {
  TableElement.call(this, config, parentIdentifier);

  var self = this;

  this.rows = _.map(config.rows, function(row) {
    return new OutputRow(row, self.identifier);
  });
}

OutputTableElement.prototype = Object.create(TableElement.prototype);
