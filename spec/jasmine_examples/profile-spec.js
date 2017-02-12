describe("Calculator", function() {
  var calculator;

  beforeEach(function() {
    calculator = new Calculator();
  });

  describe("calculator methods", function() {
    describe("calculateTaxes", function() {
        it("should apply a single tax bracket", function() {
          expect(calculator.calculateTaxes(9275)).toEqual(9275 * 0.10);
        });

        it("apply multiple tax brackets", function() {
          expect(calculator.calculateTaxes(37650)).toEqual(5183.75);
        });

        it("applying all but the last two tax brackets", function() {
          expect(calculator.calculateTaxes(200000)).toEqual(49529.25);
        });
      });

      describe("socialSecurityWithholding", function() {
        it("should apply the correct rate to the gross income", function() {
          expect(calculator.socialSecurityWithholding(100000)).toEqual(6200);
        });

        describe("with an income above the max ssn taxable level", function() {
          it("should return the maximum withholding", function() {
            expect(calculator.socialSecurityWithholding(150000)).toEqual(118500 * 0.062);
          });
        });
      });

      describe("medicateWithHolding", function() {
        it("should calculate the correct rate", function() {
          expect(calculator.medicareWithholding(100000)).toEqual(100000 * 0.0145);
        });
      });
    });
});
