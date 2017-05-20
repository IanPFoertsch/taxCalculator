'use-strict';
function ValueCalculator() {}

ValueCalculator.investmentValue = function(
  //ASSUMES CONTRIBUTIONS OCCUR AT BEGINING
  //THIS HAS A LARGER EFFECT WHEN THE INVESTMENT PERIOD IS LONGER
  presentBalance,
  interestRate,
  numberOfYears,
  annualContribution
) {
  var compoundedRate = Math.pow((interestRate + 1), numberOfYears);
  var compoundedPrinciple = presentBalance * compoundedRate;
  var compoundedContributions;

  if (interestRate === 0) {
    compoundedContributions = annualContribution * numberOfYears;
  } else {
    compoundedContributions = annualContribution * ((compoundedRate - 1) / interestRate);
  }

  return compoundedPrinciple + compoundedContributions;
};


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
