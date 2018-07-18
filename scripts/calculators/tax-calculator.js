'use-strict';
function TaxCalculator() {}

TaxCalculator.federalIncomeTax = function(taxableIncome) {
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


  var remainingIncome = taxableIncome;
  var previousBracket = 0;
  //TODO: Refine this iterative approach to make it more maintainable
  var totalTax = _.reduce(brackets, function(totalTax, rate, bracket) {
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

TaxCalculator.socialSecurityWithholding = function(income) {
  //TODO: Assume for now that the user is not self-employed
  var applicableIncome = minimum(income, Constants.SOCIAL_SECURITY_MAXIMUM);
  return applicableIncome * Constants.SOCIAL_SECURITY_RATE;
};

TaxCalculator.medicareWithholding = function(income) {
  //TODO: Assume for now that the user is not self-employed
  return income * Constants.MEDICARE_RATE
}

TaxCalculator.netIncome = function(grossIncome, deductableContributions) {
  var medicaid = TaxCalculator.medicareWithholding(grossIncome);
  var socialSecurity = TaxCalculator.socialSecurityWithholding(grossIncome);

  var taxableIncome = TaxCalculator.lessDeductions(grossIncome, deductableContributions);
  var federalIncomeTax = TaxCalculator.federalIncomeTax(taxableIncome);

  return grossIncome - (medicaid + socialSecurity + federalIncomeTax + deductableContributions) ;
};

function minimum(first, second) {
  return Math.min.apply(Math, [first, second]);
}

function numberToCurrencyString(number) {
  var currencyPrefix = '$';
  return currencyPrefix + number.toString();
}

Calculator.TaxCalculator = TaxCalculator;
