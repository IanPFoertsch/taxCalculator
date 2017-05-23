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
  let mapping = [{ 0: startingBalance }];

  _.each(_.range(1, lengthOfTime + 1), (timeIndex) => {
    var growthFromInterest = startingBalance * interestRate;
    runningBalance = runningBalance + growthFromInterest + contributionPerPeriod;
    mapping.push({[timeIndex]: runningBalance});
  });

  return mapping;
};
