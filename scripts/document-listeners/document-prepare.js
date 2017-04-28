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
      { label: 'Federal Income Tax', value: '$0.0'},
      { label: 'Social Security Withholding', value: '$0.0'},
      { label: 'Medicare Withholding', value: '$0.0'},
      { label: 'Net Income', value: '$0.0'}
    ]
  }, '.main');

  var button = new Button({
    text: 'Calculate Your Taxes',
    onClick: function() {
      outTable.update('hello');
    }

  }, '.main');

  button.prepare();
  newTable.prepare();
  outTable.prepare();
  PersonListener.prepare();
});
