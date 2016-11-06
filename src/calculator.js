var _ = require('lodash');

function Calculator(income) {

  this.income = income;
  this.brackets = {
    '9275': 0.10,
    '37650': 0.15,
    '91150': 0.25,
    '190150': 0.28,
    '413350': 0.33,
    '415050': 0.35,
    '1000000000': 0.396
  };

  this.calculateTaxes = function(income) {
    var brackets = this.brackets;
    var remainingIncome = income;
    var previousBracket = 0;
    //TODO: Refine this iterative approach to make it more maintainable
    return _.reduce(brackets, function(totalTax, rate, bracket) {
      var currentBracket = parseInt(bracket);
      var bracketMagnitude = currentBracket - previousBracket;

      var affectedIncome = Math.min.apply(Math, [remainingIncome, bracketMagnitude]);
      var taxesOwed = affectedIncome * rate;

      totalTax += taxesOwed;

      remainingIncome -= affectedIncome;
      previousBracket = currentBracket;

      return totalTax;
    }, 0);
  };

  this.socialSecurityWithholding = function() {

  };
}

module.exports = Calculator;
