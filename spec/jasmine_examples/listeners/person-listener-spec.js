
describe('PersonListener', function() {
  describe('toCamelCase', function() {
    it('should lowercase the first word', function() {
      expect(ValueCalculator.toCamelCase('Hello')).toEqual('hello');
    });

    it('should camelcase the remaining words', function() {
      expect(ValueCalculator.toCamelCase('Hello My Honey')).toEqual('helloMyHoney');
    });

    it('should handle empty strings', function() {
      expect(ValueCalculator.toCamelCase('')).toEqual('');
    });
  });

  fdescribe('toSpaced', function() {
    it('should insert spaces into a camelcased string', function() {
      expect(ValueCalculator.toSpaced('helloThisIsDog')).toEqual('Hello This Is Dog');
    });

    it('should handle empty strings', function() {
      expect(ValueCalculator.toSpaced('')).toEqual('');
    });
  });
});
