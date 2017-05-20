
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

  describe('projectInvestmentGrowth', () => {
    let startingValue = 1000;
    let lengthOfTime = 1;
    let interestRate = .1;
    let contributionPerPeriod = 0;

    var calculate = (startingValue, lengthOfTime, interestRate, contributionPerPeriod) => {
      var value = startingValue || 1000;
      var time = lengthOfTime || 1;
      var rate = interestRate || .1;
      var contributions = contributionPerPeriod || 0;

      return ValueCalculator.projectInvestmentGrowth(
        value,
        time,
        rate,
        contributions
      );
    };

    let mapping = calculate(startingValue, lengthOfTime, interestRate);

    it('should return an array of results', () => {
      expect(mapping).toEqual(jasmine.any(Array));
    });

    it('should start at year 0 with the starting value', () => {
      expect(mapping[0]).toEqual({ 0: startingValue});
    });

    it('should add interest at the end of the investment period', () => {
      expect(mapping[1]).toEqual({ 1: startingValue * (interestRate + 1) });
    });

    describe('with contributions per period', () => {
      let contributionPerPeriod = 100;

      let mapping = calculate(startingValue, lengthOfTime, interestRate, contributionPerPeriod);

      it('should add the contribution to the balance at the end of the period', () => {
        expect(mapping[1]).toEqual(
          {
            1: (startingValue * (interestRate + 1)) + contributionPerPeriod
          }
        );
      });
    });
  });
});
