'use-strict';
function ValueCalculator() {}

ValueCalculator.singlePeriodCompounding = function(startingBalance, interestRate) {
  return startingBalance * (1 + interestRate);
};


ValueCalculator.projectInvestmentGrowth = function(
  startingBalance,
  lengthOfTime,
  interestRate,
  contributionPerPeriod,
  startingYear = 0
) {
  //assumes contributions and interest accrue at end of period
  let runningBalance = startingBalance;
  let mapping = [{ x: startingYear, y: startingBalance }];

  _.each(_.range(1, lengthOfTime + 1), (timeIndex) => {
    //x = time period
    //y = value
    var growthFromInterest = runningBalance * interestRate;
    runningBalance = runningBalance + growthFromInterest + contributionPerPeriod;
    //TODO: this is some ChartJS specific logic here - extract this out into a
    //seperate ChartJS adapter
    mapping.push({ x: timeIndex + startingYear, y: runningBalance});
  });

  return mapping;
};

Calculator.ValueCalculator = ValueCalculator;
