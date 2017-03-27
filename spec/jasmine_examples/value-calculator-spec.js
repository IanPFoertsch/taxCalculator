
describe('ValueCalculator', function() {
  var startingBalance = 1000;
  var interestRate = 0.02;
  var timePeriod = 0;
  var annualContribution = 0;

  var calculate = function(startingBalance, interestRate, timePeriod, annualContribution) {
    return ValueCalculator.investmentValue(
      startingBalance,
      interestRate,
      timePeriod,
      annualContribution
    );
  };

  describe('investmentValue', function() {

    describe('with time horizon 0', function() {
      it('should return the starting balance', function() {
        expect(
          calculate(
            startingBalance,
            interestRate,
            timePeriod,
            annualContribution
          )
        ).toEqual(startingBalance);
      });
    });

    describe('with a time horizon of 1', function() {
        // var interestRate = 0.0;
        // var annualContribution = 100;
      var timePeriod = 1;

      it('should return the starting balance plus one period of interest', function() {
        expect(
          calculate(
            startingBalance,
            interestRate,
            timePeriod,
            annualContribution
          )
        ).toEqual(startingBalance * (1 + interestRate));
      });

      describe('with an annual contribution', function() {
        var interestRate = 0.00;
        var annualContribution = 100;

        it('should add the value of the annual contribution to the starting balance', function() {
          expect(
            calculate(
              startingBalance,
              interestRate,
              timePeriod,
              annualContribution
            )
          ).toEqual(startingBalance + (annualContribution * timePeriod));
        });
      });
    });
  });
});
