'use-strict';
var ValueCalculator = Calculator.ValueCalculator;

//Accepts a person object, returns a future projection
function FutureCalculator() {}

const DEFAULT_GROWTH_RATE = 0.03;
const CONTRIBUTIONS_TO_INVESTMENTS = {
  'Roth IRA Contributions': 'Roth IRA Account',
  'Traditional IRA Contributions': 'Traditional IRA Account'
};

FutureCalculator.projectFuture = function(person) {
  //TODO: extract these string literals out into a series of constants
  var workingYears = person['Years to Retirement'];
  var retirementYears = person['Retirement Length'];
  var annualSpending = person['Retirement Spending'];

  //TODO: Refactor this step out to be more modular and easier to understand
  var workingProjection = _.reduce(CONTRIBUTIONS_TO_INVESTMENTS, (memo, outputLabel, inputLabel) => {
    memo[outputLabel] = ValueCalculator.projectInvestmentGrowth(
      0,
      workingYears,
      DEFAULT_GROWTH_RATE,
      person[inputLabel]
    );
    return memo;
  }, {});
  //get the final year balances and project that into the future with annual withdrawals
  var retirementProjection = _.reduce(CONTRIBUTIONS_TO_INVESTMENTS, (memo, outputLabel, inputLabel) => {
    memo[outputLabel] = ValueCalculator.projectInvestmentGrowth(
      workingProjection[outputLabel].pop()['y'], //starting balance is the final mapped outputLabel
      retirementYears,
      DEFAULT_GROWTH_RATE,
      -annualSpending
    );
    return memo;
  }, {});

  return FutureCalculator.appendProjections(workingProjection, retirementProjection);
};

FutureCalculator.appendProjections = function(workingProjection, retirementProjection) {
  var fields = Object.values(CONTRIBUTIONS_TO_INVESTMENTS);
  result = {};
  _.each(fields, (field) => {
    result[field] = workingProjection[field].concat(retirementProjection[field]);
  })

  return result;
}



Calculator.FutureCalculator = FutureCalculator;
