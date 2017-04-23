function TitleRowElement(label) {
  this.label = label;

  this.prepare = function(parentIdentifier) {
    //TODO: this is also very similar logic between classes. figure out
    //how inheritance works in javascript and use that
    var parent = document.querySelector(parentIdentifier);

    var div = document.createElement('Div');
    div.className += "title-row";
    div.innerText = this.label;

    parent.appendChild(div);
  };
}
