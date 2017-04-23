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
