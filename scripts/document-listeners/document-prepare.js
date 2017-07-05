document.addEventListener("DOMContentLoaded", function() {

  var inputRows = [
    { label: 'Gross Income', type: 'number', default: 50000, output: 'Gross Income' },
    { label: 'Traditional IRA Contributions', type: 'number', default: 5000, output: Constants.TRADITIONAL_IRA },
    { label: 'Roth IRA Contributions', type: 'number', default: 2000, output: Constants.ROTH_IRA },
    { label: 'Brokerage Investments', type: 'number', default: 1000, output: Constants.BROKERAGE },
    { label: 'Years to Retirement', type: 'number', default: 20, output: 'Years to Retirement'},
    { label: 'Retirement Spending', type: 'number', default: 10000, output: 'Retirement Spending' },
    { label: 'Retirement Length', type: 'number', default: 30, output: 'Retirement Length' },
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
  ];

  _.each(prepareables, (prepareable) => {
    prepareable.prepare();
  });

  //TODO: Consolidate this step - this is really updating the DOM,
  //so we should have a prepareables object list and a updateable function list
  var updateables = [
    calculateProjection(personListener, netWorthChart),
    calculateTaxes(personListener, taxTable)
  ];

  _.each(updateables, (updateable) => {
    updateable();
  });
});
