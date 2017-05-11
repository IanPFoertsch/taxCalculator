document.addEventListener("DOMContentLoaded", function() {

  var inputRows = [
    { label: 'Gross Income', type: 'number' },
    { label: 'Pre-Tax Contributions', type: 'number' },
    { label: 'Roth Contributions', type: 'number' },
    { label: 'Brokerage Invesments', type: 'number' },
    { label: 'Years to Retirement', type: 'number' },
  ];

  var newTable =  new InputTableElement({
    cssClasses: ['person-table'],
    titleRow: { title: 'Enter Your Financial Information' },
    rows: inputRows
  }, '.left-bar');

  var personListener = new PersonListener(inputRows);

  var outTable = new OutputTableElement({
    cssClasses: ['output-table'],
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
      var person = personListener.getInput();
      var taxes = TaxCalculator.calculateTaxes(person);
      outTable.update(taxes);
      //have to perform the tax calculations here, then feed the
      //correctly labelled values to the output table
    }
  }, '.main');

  button.prepare();
  newTable.prepare();
  outTable.prepare();
});
