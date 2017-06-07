document.addEventListener("DOMContentLoaded", function() {

  var inputRows = [
    { label: 'Gross Income', type: 'number', default: 50000 },
    { label: 'Traditional IRA Contributions', type: 'number', default: 5000 },
    { label: 'Roth IRA Contributions', type: 'number', default: 2000 },
    { label: 'Brokerage Investments', type: 'number', default: 1000 },
    { label: 'Years to Retirement', type: 'number', default: 20 },
    { label: 'Retirement Spending', type: 'number', default: 10000 },
    { label: 'Retirement Length', type: 'number', default: 30 },
  ];

  var inputTable =  new InputTableElement({
    cssClasses: ['person-table'],
    titleRow: { title: 'Enter Your Financial Information' },
    rows: inputRows
  }, '.left-bar');

  var personListener = new PersonListener(inputRows);

  var taxTable = new OutputTableElement({
    cssClasses: ['output-table'],
    titleRow: { title: 'Tax Breakdown' },
    rows: [
      { label: 'Federal Income Tax', value: '$0.0'},
      { label: 'Social Security Withholding', value: '$0.0'},
      { label: 'Medicare Withholding', value: '$0.0'},
      { label: 'Net Income', value: '$0.0'}
    ]
  }, '.main');

  //net worth chart
  var netWorthChart = new ChartHolder({
    cssClasses: ['chart-holder'],
    canvas: {}
  }, '.main');

  //withdrawal chart
  var withdrawalChart = new ChartHolder({
    cssClasses: ['chart-holder'],
    canvas: {}
  }, '.main');

  var calculateProjection = function(personListener, chart) {
    return () => {
      var person = personListener.getInput();
      var projection = FutureCalculator.projectFuture(person);
      chart.update(projection);
    };
  };

  var calculateTaxes = function(personListener, taxTable) {
    return () => {
      var person = personListener.getInput();
      var taxes = TaxCalculator.calculateTaxes(person);
      taxTable.update(taxes);
    };
  };

  var taxButton = new Button({
    text: 'Calculate Your Taxes',
    onClick: calculateTaxes(personListener, taxTable)
  }, '.main');

  var projectionButton = new Button({
    text: 'Project Income',
    onClick: calculateProjection(personListener, netWorthChart)
  }, '.main');


  var prepareables = [
    taxButton,
    projectionButton,
    inputTable,
    taxTable,
    netWorthChart,
    withdrawalChart
  ];

  _.each(prepareables, (prepareable) => {
    prepareable.prepare();
  });

  //TODO: Consolidate this construction step.
  calculateProjection(personListener, netWorthChart)();
  calculateTaxes(personListener, taxTable)();
});
