function TableElement() {
  this.prepare = function(parentIdentifier, cssClasses) {
    var parent = document.querySelector(parentIdentifier);

    var child = document.createElement("Table");

    child.className += cssClasses;

    parent.appendChild(child);
  };
}
