function TitleRowElement(config, parentIdentifier) {
  this.title = config.title;
  this.parentIdentifier = parentIdentifier;

  this.prepare = function() {
    //TODO: this is also very similar logic between classes. figure out
    //how inheritance works in javascript and use that
    var parent = document.querySelector(this.parentIdentifier);

    var div = document.createElement('Div');
    div.className += "title-row";
    div.innerText = this.title;

    parent.appendChild(div);
  };
}
