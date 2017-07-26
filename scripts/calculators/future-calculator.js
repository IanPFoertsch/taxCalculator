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
  //TODO: create a person model and consolidate this logic there
  var workingYears = person['Years to Retirement'];

  var workingProjection = _.reduce(ACCOUNT_TYPES, (memo, accountType) => {
    memo[accountType] = ValueCalculator.projectInvestmentGrowth(
      0,
      workingYears,
      DEFAULT_GROWTH_RATE,
      person[accountType]
    );
    return memo;
  }, {});
  //TODO: Once we have withdrawal strategies, add the spend-down period here
  return FutureCalculator.convertToObjectifiedForm(workingProjection, workingYears);
};

FutureCalculator.convertToObjectifiedForm = function(projection, totalTimePeriod) {
  return _.reduce(_.range(0, totalTimePeriod + 1), (memo, timeIndex) => {
    var values = _.reduce(ACCOUNT_TYPES, (type_memo, type) => {
      type_memo[type] = projection[type][timeIndex];
      return type_memo;
    }, {});

    memo.push(values);

    return memo;
  }, []);
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
