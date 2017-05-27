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
  let runningBalance = startingBalance;
  let mapping = [{ x: 0, y: startingBalance }];

  _.each(_.range(1, lengthOfTime + 1), (timeIndex) => {
    //x = time period
    //y = value
    var growthFromInterest = runningBalance * interestRate;
    runningBalance = runningBalance + growthFromInterest + contributionPerPeriod;
    mapping.push({ x: timeIndex, y: runningBalance});
  });

  return mapping;
};

Calculator.ValueCalculator = ValueCalculator;
