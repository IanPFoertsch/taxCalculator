var Account = Models.Account
var Person = Models.Person


describe('Person', function() {
  var person

  var start = 0
  var end = 1
  var value = 100

  beforeEach(() => {
    person = new Person()
  })

  describe('createEmploymentIncome', () => {


    it('should register an income', () => {
      person.createEmploymentIncome(
        value,
        start,
        end
      )

      expect(person.getValue()).toEqual(value * 2)
    })
  })

  describe('traditional contributions', () => {
    beforeEach(() => {
      person.createEmploymentIncome(
        value,
        start,
        end
      )
    })

    describe('createTraditionalIRAContribution', () => {
      beforeEach(() => {
        person.createTraditionalIRAContribution(value, start, end)
      })

      it('does not increase the persons overall wealth', () => {
        expect(person.getValue()).toEqual(value * 2)
      })

      it('reduces value in the wages and compensation account', () => {
        var wages = person.getAccount(Constants.WAGES_AND_COMPENSATION)
        expect(wages.getValue()).toEqual(0)
      })
    })
  })

  describe ('createTaxFlows', () => {

  })
})
