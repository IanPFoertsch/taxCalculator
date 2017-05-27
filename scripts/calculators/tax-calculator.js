'use-strict';
function TaxCalculator() {}

TaxCalculator.calculateTaxes = function(personObject) {
  let grossIncome = personObject['Gross Income'] || 0;
  let preTaxContributions = personObject['Pre-Tax Contributions'] || 0;

  let incomeLessDeductions = this.lessDeductions(grossIncome, preTaxContributions);
  var taxes = {
    'Federal Income Tax': this.federalIncomeTax(incomeLessDeductions),
    'Social Security Withholding': this.socialSecurityWithholding(grossIncome),
    'Medicare Withholding': this.medicareWithholding(grossIncome),
    'Net Income': this.netIncome(grossIncome, preTaxContributions)
  };

  return taxes;
};

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
  var maxSSNTaxableEarnings = 118500;
  var socialSecurityWithholdingRate = 0.062;
  var applicableIncome = minimum(income, maxSSNTaxableEarnings);
  return applicableIncome * socialSecurityWithholdingRate;
};

TaxCalculator.medicareWithholding = function (income) {
  var medicareWithholdingRate = 0.0145;
  return income * medicareWithholdingRate;
};

TaxCalculator.lessDeductions = function (income, deductableContributions) {

  //TODO: extract these to a JSON config
  var deductionsAndExemptions = {
    'standardDeduction': 6350,
    'personalExemption': 4050, //assumption is that this is for a single person
    'deductableContributions': deductableContributions
  };

  var totalDeductions = _.reduce(deductionsAndExemptions, function(total, value) {
    return (total + value);
  }, 0);

  return income - totalDeductions;
};

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
