var DataAdapter = Adapters.DataAdapter
var Person = Models.Person

describe('DataAdapter', function() {
  var person
  var adapter

  describe('netWorthData', () => {
    beforeEach(() => {
      person = new Person()
      person.createEmploymentIncome(50000, 0, 30)
      person.createTraditionalIRAContribution(3000, 0, 30)
      person.createRothIRAContribution(2000, 0, 30)
    })

    it('should convert to a series of data for each variable', () => {
      result = DataAdapter.netWorthData(person)
    })

    it('should format the data to {x: _, y: _} format', () => {
      expect(result.a[0]).toEqual({ x:0, y: 1 })
      expect(result.a[1]).toEqual({ x:1, y: 2 })
    })
  })
})
