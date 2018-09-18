var TaxCalculator = Calculator.TaxCalculator;

describe('TaxCalculator', function() {
  describe('federalIncomeTax', () => {
    describe('with a taxable income below 0', () =>{
      it('returns 0', () => {
        expect(TaxCalculator.federalIncomeTax(-10)).toEqual(0)
      })
    })

    describe('with a taxable income of 0', () =>{
      it('returns 0', () => {
        expect(TaxCalculator.federalIncomeTax(-10)).toEqual(0)
      })
    })

    describe('with a taxable income equal to the first tax bracket ', () =>{
      it('returns the taxable income multiplied by the tax bracket', () => {
        var taxableIncome = parseInt(Object.keys(Constants.FEDERAL_INCOME_BRACKETS)[0])
        expect(TaxCalculator.federalIncomeTax(taxableIncome))
          .toEqual(
            taxableIncome * Constants.FEDERAL_INCOME_BRACKETS[taxableIncome]
          )
      })

      //TODO: fill in these test cases
    })
  })

  describe('socialSecurityWithholding', function() {
    it('should apply the correct rate to the Constants.WAGES_AND_COMPENSATION', function() {
      expect(TaxCalculator.socialSecurityWithholding(100000)).toEqual(6200);
    });

    describe('with an income above the max ssn taxable level', function() {
      it('should return the maximum withholding', function() {
        expect(TaxCalculator.socialSecurityWithholding(150000)).toEqual(118500 * 0.062);
      });
    });
  });

  describe('medicareWithHolding', function() {
    it('should calculate the correct rate', function() {
      expect(TaxCalculator.medicareWithholding(100000)).toEqual(100000 * 0.0145);
    });
  });
});
