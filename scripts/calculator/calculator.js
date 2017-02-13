function federalTaxes(incomeStr) {
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
}



function socialSecurityWithholding(incomeStr) {
  var grossIncome = parseInt(incomeStr);
  var maxSSNTaxableEarnings = 118500;
  var socialSecurityWithholdingRate = 0.062;
  applicableIncome = minimum(grossIncome, maxSSNTaxableEarnings);
  return applicableIncome * socialSecurityWithholdingRate;
}

function medicareWithholding(incomeStr) {
  var grossIncome = parseInt(incomeStr);
  var medicareWithholdingRate = 0.0145;
  return grossIncome * medicareWithholdingRate;
}

function minimum(first, second) {
  return Math.min.apply(Math, [first, second]);
}
