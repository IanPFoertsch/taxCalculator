'use-strict';
function TaxCalculator() {}

TaxCalculator.federalIncomeTax = function(incomeStr, standardDeduction) {
  var grossIncome = parseInt(incomeStr);
  //TODO: split this out into a loaded config file
  var brackets = {
    '9275': 0.10,
    '37650': 0.15,
    '91150': 0.25,
    '190150': 0.28,
    '413350': 0.33,
    '415050': 0.35,
    '1000000000': 0.396
  };

  var remainingIncome = grossIncome;
  var previousBracket = 0;
  //TODO: Refine this iterative approach to make it more maintainable
  totalTax = _.reduce(brackets, function(totalTax, rate, bracket) {
    var currentBracket = parseInt(bracket);
    var bracketMagnitude = currentBracket - previousBracket;

    var affectedIncome = minimum(remainingIncome, bracketMagnitude);
    var taxesOwed = affectedIncome * rate;

    totalTax += taxesOwed;

    remainingIncome -= affectedIncome;
    previousBracket = currentBracket;

    return totalTax;
  }, 0);
  return totalTax;
};

TaxCalculator.socialSecurityWithholding = function(incomeStr) {
  var grossIncome = parseInt(incomeStr);
  var maxSSNTaxableEarnings = 118500;
  var socialSecurityWithholdingRate = 0.062;
  applicableIncome = minimum(grossIncome, maxSSNTaxableEarnings);
  return applicableIncome * socialSecurityWithholdingRate;
};

TaxCalculator.medicareWithholding = function (incomeStr) {
  var grossIncome = parseInt(incomeStr);
  var medicareWithholdingRate = 0.0145;
  return grossIncome * medicareWithholdingRate;
};

TaxCalculator.applicableDeductions = function (income) {
  //ideally this would accept a profile object and return the amount
  //of deductable income, but for now, just remove the standard deduction
  //and the personal exemption

  //TODO: extract these to a JSON config
  var deductionsAndExemptions = {
    'standardDeduction': 6350,
    'personalExemption': 4050 //assumption is that this is for a single person
  };

  totalDeductions = _.reduce(deductionsAndExemptions, function(total, value, key) {
    return (total + value);
  }, 0);

  return income - totalDeductions;
};

function minimum(first, second) {
  return Math.min.apply(Math, [first, second]);
}

function numberToCurrencyString(number) {
  currencyPrefix = '$';
  return currencyPrefix + number.toString();
}
