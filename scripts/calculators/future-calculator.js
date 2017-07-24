'use-strict';
var ValueCalculator = Calculator.ValueCalculator;
var TaxCalculator = Calculator.TaxCalculator;
const ACCOUNT_TYPES = [
  Constants.ROTH_IRA,
  Constants.TRADITIONAL_IRA,
  Constants.BROKERAGE
];
var DEFAULT_GROWTH_RATE = Constants.DEFAULT_GROWTH_RATE;


function FutureCalculator() {}

FutureCalculator.projectCashFlows = function(person) {
  var workingYears = person['Years to Retirement'];
  //TODO: The income during retirement depends upon the withdrawal strategy
  //Leave this unimplemented for now until we work out the withdrawal strategy
  //problem
  // var retirementYears = person['Retirement Length'];

  // _.each(_.range(1, lengthOfTime + 1), (timeIndex) => {
  var workingProjection = _.reduce(_.range(workingYears), (memo) => {
    var projection = TaxCalculator.calculateTaxes(person);
    //Add the account contributions to the projection
    _.each(ACCOUNT_TYPES, (account_type) => {
      //Assume for now that contributions remain constant
      projection[account_type] = person[account_type] || 0;
    });
    memo.push(projection);
    return memo;
  }, []);

  return workingProjection;
};

FutureCalculator.projectAccounts = function(person) {
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
        // TODO: At the moment we're subtracting the annual spending from
        // each account - add withdrawal strategies.
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
