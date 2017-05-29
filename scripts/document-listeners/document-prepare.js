document.addEventListener("DOMContentLoaded", function() {

  var inputRows = [
    { label: 'Gross Income', type: 'number', default: 50000 },
    { label: 'Pre-Tax Contributions', type: 'number', default: 5000 },
    { label: 'Roth Contributions', type: 'number', default: 2000 },
    { label: 'Brokerage Investments', type: 'number', default: 1000 },
    { label: 'Years to Retirement', type: 'number', default: 20 },
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

  var chart = new ChartHolder({
    cssClasses: ['chart-holder'],
    canvas: {
    }
  }, '.main');

  var button = new Button({
    text: 'Calculate Your Taxes',
    onClick: function() {
      var person = personListener.getInput();
      var taxes = TaxCalculator.calculateTaxes(person);
      outTable.update(taxes);
      var projection = FutureCalculator.projectFuture(person);
      chart.update(projection);
    }
  }, '.main');

  button.prepare();
  newTable.prepare();
  outTable.prepare();
  chart.prepare();
  //TODO: extract this out to a shared new "listener class"
  var person = personListener.getInput();
  var taxes = TaxCalculator.calculateTaxes(person);
  outTable.update(taxes);
  var projection = FutureCalculator.projectFuture(person);
  chart.update(projection);

});
