'use-strict';
var ValueCalculator = Calculator.ValueCalculator;
const ACCOUNT_TYPES = [
  Constants.ROTH_IRA,
  Constants.TRADITIONAL_IRA,
  Constants.BROKERAGE
];
var DEFAULT_GROWTH_RATE = Constants.DEFAULT_GROWTH_RATE;

//Accepts a person object, returns a future projection
function FutureCalculator() {}

FutureCalculator.projectFuture = function(person) {
  //TODO: extract these string literals out into a series of constants
  var workingYears = person['Years to Retirement'];
  var retirementYears = person['Retirement Length'];
  var annualSpending = person['Retirement Spending'];

  var workingProjection = _.reduce(ACCOUNT_TYPES, (memo, accountType) => {
    memo[accountType] = ValueCalculator.projectInvestmentGrowth(
      0,
      workingYears,
      DEFAULT_GROWTH_RATE,
      person[accountType]
    );
    return memo;
  }, {});

  //get the final year balances and project that into the future with annual withdrawals
  if(retirementYears) {
    var retirementProjection = _.reduce(ACCOUNT_TYPES, (memo, accountType) => {
      memo[accountType] = ValueCalculator.projectInvestmentGrowth(
        workingProjection[accountType].pop()['y'], //starting balance is the final mapped outputLabel
        retirementYears,
        DEFAULT_GROWTH_RATE,
        -annualSpending,
        workingYears
      );
      return memo;
    }, {});
    return FutureCalculator.appendProjections(workingProjection, retirementProjection);
  } else {
    return workingProjection;
  }
};

FutureCalculator.appendProjections = function(workingProjection, retirementProjection) {
  var result = {};
  _.each(ACCOUNT_TYPES, (accountType) => {
    result[accountType] = workingProjection[accountType].concat(
      retirementProjection[accountType]
    );
  });

  return result;
};




Calculator.FutureCalculator = FutureCalculator;
