document.addEventListener("DOMContentLoaded", function() {
  TaxCalculatorListener.prepare();
  var newTable =  new InputTableElement({
    cssClasses: 'person-table',
    titleRow: { title: 'Enter Your Financial Information' },
    rows: [
      { label: 'Gross Income', type: 'number' },
      { label: 'Pre-Tax Contributions', type: 'number' },
      { label: 'Roth Contributions', type: 'number' },
      { label: 'Brokerage Invesments', type: 'number' },
      { label: 'Years to Retirement', type: 'number' },
    ]
  }, '.left-bar');


  var outTable = new OutputTableElement({
    cssClasses: 'output-table',
    titleRow: { title: 'Tax Breakdown' },
    rows: [
      { label: 'Federal Income Tax', value: '$1000'}
    ]
  }, '.main');


  newTable.prepare();
  outTable.prepare();
  PersonListener.prepare();
});
