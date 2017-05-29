'use-strict';
var ValueCalculator = Calculator.ValueCalculator;

//Accepts a person object, returns a future projection
function FutureCalculator() {}

const DEFAULT_GROWTH_RATE = 0.03;

FutureCalculator.projectFuture = function(person) {
  //get the brokerage investments and years to retirement and return a data Security
  var years = person['Years to Retirement'];
  var investmentFields = [
    'Pre-Tax Contributions',
    'Roth Contributions'
  ]

  return _.reduce(investmentFields, (memo, label) => {
    memo[label] = ValueCalculator.projectInvestmentGrowth(
      0,
      years,
      DEFAULT_GROWTH_RATE,
      person[label]
    );
    return memo;
  }, {});
};

Calculator.FutureCalculator = FutureCalculator;
