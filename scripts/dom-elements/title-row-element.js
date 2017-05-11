function TitleRowElement(config, parentIdentifier) {
  DOMElement.call(this, config, parentIdentifier);
  this.title = config.title;
  this.type = 'Div';
}

TitleRowElement.prototype = Object.create(DOMElement.prototype);

TitleRowElement.prototype.prepare = function() {
  console.log('title row stuff');
  DOMElement.prototype.prepare.call(this);

  this.element.innerText = this.title;

  // div.className += "title-row";
  // div.innerText = this.title;

  // this.parent.appendChild(div);
};
