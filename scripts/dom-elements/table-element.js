const INPUT_TABLE_CLASS = 'input-table';
const OUTPUT_TABLE_CLASS = 'output-table';
const TABLE_TYPE = 'Table';

function TableElement(config, parentIdentifier) {
  DOMElement.call(this, config, parentIdentifier);

  this.type = TABLE_TYPE;
  this.titleRow = new TitleRowElement(config.titleRow, this.identifier);
}

TableElement.prototype = Object.create(DOMElement.prototype);

TableElement.prototype.prepare = function() {
  DOMElement.prototype.prepare.call(this);
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

OutputTableElement.prototype.update = function(output) {
  _.each(this.rows, function(row) {
    var updatedInfo = output[row.label.innerText];
    row.update(updatedInfo);
  });
};
