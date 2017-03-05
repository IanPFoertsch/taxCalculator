describe('Calculator', function() {
  describe('calculateTaxes', function() {
    it('should apply a single tax bracket', function() {
      expect(federalIncomeTax(9275)).toEqual(9275 * 0.10);
    });

    it('apply multiple tax brackets', function() {
      expect(federalIncomeTax(37650)).toEqual(5183.75);
    });

    it('applying all but the last two tax brackets', function() {
      expect(federalIncomeTax(200000)).toEqual(49529.25);
    });
  });

  describe('socialSecurityWithholding', function() {
    it('should apply the correct rate to the gross income', function() {
      expect(socialSecurityWithholding(100000)).toEqual(6200);
    });

    describe('with an income above the max ssn taxable level', function() {
      it('should return the maximum withholding', function() {
        expect(socialSecurityWithholding(150000)).toEqual(118500 * 0.062);
      });
    });
  });

  describe('medicareWithHolding', function() {
    it('should calculate the correct rate', function() {
      expect(medicareWithholding(100000)).toEqual(100000 * 0.0145);
    });
  });

  describe('less applicable deductions', function() {
    var grossIncome = 50000;
    fit('should subtract the applicable deductions for a single person', function() {
      //TODO: this is dumb. create more meaningful unit tests.
      expect(applicableDeductions(grossIncome)).toEqual(50000 - 10400);
    });
  });
});
