'use-strict';
function ValueCalculator() {}

ValueCalculator.investmentValue = function(
  //ASSUMES CONTRIBUTIONS OCCUR AT END OF INVESTMENT PERIOD
  //THIS HAS A LARGER EFFECT WHEN THE INVESTMENT PERIOD IS LONGER
  presentBalance,
  interestRate,
  numberOfYears,
  annualContribution
) {
  //P = initial principle,
  //A = yearly contribution
  //i = interest rate
  //balance = (P + a/i) * (1+i)^years - A/i
  var compoundedRate = Math.pow((interestRate + 1), numberOfYears);
  var compoundedPrinciple = presentBalance * compoundedRate;
  console.log(compoundedPrinciple);
  var compoundedContributions;
  if (interestRate === 0) {
    compoundedContributions = annualContribution * numberOfYears;
  } else {
    compoundedContributions = annualContribution * ((compoundedRate - 1) / interestRate);
  }

  return compoundedPrinciple + compoundedContributions;



};
