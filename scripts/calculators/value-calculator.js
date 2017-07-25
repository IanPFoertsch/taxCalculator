'use-strict';
function ValueCalculator() {}

ValueCalculator.singlePeriodCompounding = function(startingBalance, interestRate) {
  return startingBalance * (1 + interestRate);
};


ValueCalculator.projectInvestmentGrowth = function(
  startingBalance,
  lengthOfTime,
  interestRate,
  contributionPerPeriod
) {
  //assumes contributions and interest accrue at end of period
  return _.reduce(_.range(1, lengthOfTime + 1), (memo) => {
    var runningBalance = memo[memo.length - 1];
    var growthFromInterest = runningBalance * interestRate;
    runningBalance = runningBalance + growthFromInterest + contributionPerPeriod;
    memo.push(runningBalance);
    return memo;
  }, [startingBalance]);
};

Calculator.ValueCalculator = ValueCalculator;
