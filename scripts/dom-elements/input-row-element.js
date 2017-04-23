function InputRowElement(config, parentIdentifier) {
  this.config = config;
  this.parentIdentifier = parentIdentifier;

  this.prepare = function() {
    //TODO: this is also very similar logic between classes. figure out
    //how inheritance works in javascript and use that
    var parent = document.querySelector(this.parentIdentifier);
    var div = document.createElement('Div');

    div.className += "input-row";

    var input = document.createElement('Input');

    input.type = config.type;
    input.name = config.label;

    var label = document.createElement('Label');

    label.innerText = config.label;

    div.appendChild(label);
    div.appendChild(input);

    parent.appendChild(div, parent);
  };
}
