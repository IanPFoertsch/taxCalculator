
describe('ValueCalculator', function() {
  describe('projectInvestmentGrowth', () => {
    let startingValue = 1000;
    let lengthOfTime = 1;
    let interestRate = 0.1;
    let contributionPerPeriod = 0;

    var calculate = (startingValue, lengthOfTime, interestRate, contributionPerPeriod) => {
      var value = startingValue || 1000;
      var time = lengthOfTime || 1;
      var rate = interestRate || 0.1;
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
