document.addEventListener("DOMContentLoaded", function() {
  TaxCalculatorListener.prepare();
  var newTable =  new TableElement();
  var titleRow = new TitleRowElement('this is the title');
  var newInputRowElement = new InputRowElement('placeholder');

  newTable.prepare('.left-bar', 'person-table');
  titleRow.prepare('.person-table');
  newInputRowElement.prepare('.person-table');
});
