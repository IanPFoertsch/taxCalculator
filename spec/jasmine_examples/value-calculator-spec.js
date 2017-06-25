
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

    it('should start at year 0 with the starting value', () => {
      expect(mapping[0]).toEqual({ x: 0, y: startingValue});
    });

    describe('interest', () => {
      it('should add interest at the end of the investment period', () => {
        expect(mapping[1]).toEqual({ x: 1, y: startingValue * (interestRate + 1) });
      });

      describe('with a 0 startingValue and non-zero contributions', () => {
        let contributionPerPeriod = 100;
        let mapping = calculate(0, 2, interestRate, contributionPerPeriod);
        it('should add interest from contributions at the end of the period', () => {
          expect(mapping[2]).toEqual({
            x: 2,
            y: contributionPerPeriod * 2 + (interestRate * contributionPerPeriod)
          });
        });
      });
    });

    describe('with contributions per period', () => {
      let contributionPerPeriod = 100;
      let mapping = calculate(startingValue, lengthOfTime, interestRate, contributionPerPeriod);

      it('should add the contribution to the balance at the end of the period', () => {
        expect(mapping[1]).toEqual(
          {
            x: 1,
            y: (startingValue * (interestRate + 1)) + contributionPerPeriod
          }
        );
      });
    });

    describe('with an optional starting year', () => {
      let startingYear = 10;
      let mapping = ValueCalculator.projectInvestmentGrowth(
        startingValue,
        lengthOfTime,
        interestRate,
        contributionPerPeriod,
        startingYear
      );

      it('should start the calculations at the specified starting period', () => {
        expect(mapping[0].x).toEqual(startingYear);
      });

      it('should add the starting period to each time index', () => {
        expect(mapping[1].x).toEqual(startingYear + 1);
      });
    });
  });
});
