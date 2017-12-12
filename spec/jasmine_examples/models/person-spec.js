var Account = Models.Account
var Person = Models.Person


describe('Person', function() {
  var person

  beforeEach(() => {
    person = new Person()

  })

  describe('create income', () => {
    var start = 0
    var end = 1
    var value = 100

    fit('should register incomes', () => {
      person.createEmploymentIncome(
        value,
        start,
        end
      )
      expect(person.getValue()).toEqual(value * 2)
    })

  })

})
