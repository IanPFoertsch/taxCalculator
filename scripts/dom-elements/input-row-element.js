function InputRowElement(label, fun) {
  this.label = label;
  this.functions = fun;

  this.prepare = function(parentIdentifier) {
    //TODO: this is also very similar logic between classes. figure out
    //how inheritance works in javascript and use that
    var parent = document.querySelector(parentIdentifier);

    var div = document.createElement('Div');

    div.className += "input-row";

    var input = document.createElement('Input');
    input.name = this.label;

    var label = document.createElement('Label');
    label.innerText = this.label;

    div.appendChild(label);
    div.appendChild(input);

    parent.appendChild(div, parent);
  };
}
