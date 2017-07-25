var ValueCalculator = Calculator.ValueCalculator;

describe('ValueCalculator', function() {
  describe('projectInvestmentGrowth', () => {
    let startingValue = 1000;
    let lengthOfTime = 1;
    let interestRate = 0.1;
    let contributionPerPeriod = 0;

    var calculate = (startingValue, lengthOfTime, interestRate, contributionPerPeriod) => {
      return ValueCalculator.projectInvestmentGrowth(
        startingValue,
        lengthOfTime,
        interestRate,
        contributionPerPeriod
      );
    };

    let mapping = calculate(startingValue, lengthOfTime, interestRate, contributionPerPeriod);

    it('should return an array of results', () => {
      expect(mapping).toEqual(jasmine.any(Array));
    });

    it('should contain the time periods starting value', () => {
      expect(mapping[0]).toEqual(startingValue);
    });

    describe('interest', () => {
      it('should add interest at the end of the investment period', () => {
        expect(mapping[1]).toEqual(startingValue * (interestRate + 1));
      });

      describe('with a 0 startingValue and non-zero contributions', () => {
        let contributionPerPeriod = 100;
        let mapping = calculate(0, 2, interestRate, contributionPerPeriod);
        it('should add interest from contributions at the end of the period', () => {
          expect(mapping[2]).toEqual(
            contributionPerPeriod * 2 + (interestRate * contributionPerPeriod)
          );
        });
      });
    });

    describe('with contributions per period', () => {
      let contributionPerPeriod = 100;
      let mapping = calculate(startingValue, lengthOfTime, interestRate, contributionPerPeriod);

      it('should add the contribution to the balance at the end of the period', () => {
        expect(mapping[1]).toEqual(
          (startingValue * (interestRate + 1)) + contributionPerPeriod
        );
      });
    });
  });
});
