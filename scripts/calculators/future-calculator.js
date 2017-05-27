'use-strict';
var ValueCalculator = Calculator.ValueCalculator;

//Accepts a person object, returns a future projection
function FutureCalculator() {}

const DEFAULT_GROWTH_RATE = 0.03;

FutureCalculator.projectFuture = function(person) {
  //get the brokerage investments and years to retirement and return a data Security
  var years = person['Years to Retirement'];
  var investments = person['Brokerage Investments'];


  return ValueCalculator.projectInvestmentGrowth(
    0,
    years,
    DEFAULT_GROWTH_RATE,
    investments
  );
};


Calculator.FutureCalculator = FutureCalculator;
