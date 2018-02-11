document.addEventListener('DOMContentLoaded', function() {

  var inputRows = [
    { label: 'Gross Income', type: 'number', default: 50000, output: 'Gross Income' },
    { label: 'Traditional Contributions', type: 'number', default: 5000, output: Constants.TRADITIONAL_IRA },
    { label: 'Roth Contributions', type: 'number', default: 2000, output: Constants.ROTH_IRA },
    // { label: 'Brokerage Investments', type: 'number', default: 1000, output: Constants.BROKERAGE },
    { label: 'Years to Retirement', type: 'number', default: 20, output: 'Years to Retirement'},
    { label: 'Age', type: 'number', default: 30, output: 'Age' },
    { label: 'Retirement Spending', type: 'number', default: 10000, output: 'Retirement Spending' },
    { label: 'Retirement Length', type: 'number', default: 30, output: 'Retirement Length' },
  ];

  var inputTable =  new InputTableElement({
    cssClasses: ['person-table'],
    titleRow: { title: 'Enter Your Financial Information' },
    rows: inputRows
  }, '.left-bar');

  var personListener = new PersonListener(inputRows);

  var netWorthChart = new ChartHolder({
    cssClasses: ['chart-holder'],
    canvas: { type: 'line'},
    updateFunction: function(personListener) {
      return function(chart) {
        var person = personListener.getInput();
        var accountProjection = FutureCalculator.projectAccounts(person);

        var converted = ChartJSAdapter.lineChartConversion(accountProjection);
        this.update(converted);
      };
    }(personListener)
  }, '.main');

  var cashFlowChart = new ChartHolder({
    cssClasses: ['chart-holder'],
    canvas: { type: 'bar'},
    updateFunction: function(personListener) {
      return function(chart) {
        var person = personListener.getInput();
        var cashFlows = FutureCalculator.projectCashFlows(person);
        this.update(cashFlows);
      };
    }(personListener)
  }, '.main');


  var calculateProjection = function(personListener, charts) {
    return () => {
      var person = personListener.getInput();
      var accountProjection = FutureCalculator.projectAccounts(person);
      _.each(charts, (chart) => {
        chart.update(accountProjection);
      });
    };
  };


  var projectionButton = new Button({
    text: 'Project Income',
    onClick: function() {
      _.each([netWorthChart, cashFlowChart], (chartHolder) => {
        chartHolder.updateFunction();
      });
    }
  }, '.main');

  //Prepare and populate the DOM
  var prepareables = [
    projectionButton,
    inputTable,
    netWorthChart,
    cashFlowChart,
  ];

  _.each(prepareables, (prepareable) => {
    prepareable.prepare();
  });

  //TODO: this is a duplication of the update logic - remove me
  var updateables = [
    netWorthChart, cashFlowChart
  ];

  _.each(updateables, (updateable) => {
    updateable.updateFunction();
  });
});
