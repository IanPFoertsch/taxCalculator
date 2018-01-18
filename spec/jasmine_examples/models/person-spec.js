var Account = Models.Account
var Person = Models.Person
var CashFlow = Models.CashFlow


fdescribe('Person', function() {
  var person

  var accountCreationAndMemoization = function(functionName, accountsIdentifier) {
    var accountType = 'SomeAccountType'
    beforeEach(() => {
      person = new Person()
    })

    it('creates an account if one does not exist', () => {
      expect(person[accountsIdentifier][accountType]).toEqual(undefined)
      person[functionName](accountType)
      expect(person[accountsIdentifier][accountType]).toEqual(jasmine.any(Account))
    })

    it('uses the pre-existing account of that name if one exists', () => {
      var preExistingAccount = person[functionName](accountType)
      expect(person[functionName](accountType)).toBe(preExistingAccount)
    })
  }

  describe('getAccount', () => {
    accountCreationAndMemoization('getAccount', 'accounts')
  })

  describe('getThirdPartyAccount', () => {
    accountCreationAndMemoization('getThirdPartyAccount', 'thirdPartyAccounts')
  })

  describe('getTaxCategory', () => {
    accountCreationAndMemoization('getTaxCategory', 'taxCategories')
  })

  describe('createFlows', () => {
    var person
    var start = 0
    var end
    var value = 100

    beforeEach(() => {
      person = new Person()
    })

    it('should register an flow from the source to the target', () => {
      end = 0
      person.createFlows(
        value,
        start,
        end,
        person.getThirdPartyAccount(Constants.EMPLOYER),
        person.getAccount(Constants.WAGES_AND_COMPENSATION)
      )

      var account = person.getAccount(Constants.WAGES_AND_COMPENSATION)
      var cashFlow = account.contributions[start][0]
      expect(cashFlow).toEqual(jasmine.any(CashFlow))
      expect(cashFlow.getValue()).toEqual(value)
    })

    it('should register flows for each requested time period', () => {
      end = 2
      person.createFlows(
        value,
        start,
        end,
        person.getThirdPartyAccount(Constants.EMPLOYER),
        person.getAccount(Constants.WAGES_AND_COMPENSATION)
      )

      var account = person.getAccount(Constants.WAGES_AND_COMPENSATION)
      _.forEach(_.range(start, end + 1), (time) => {
        var cashFlow = account.contributions[time][0]
        expect(cashFlow).toEqual(jasmine.any(CashFlow))
        expect(cashFlow.getValue()).toEqual(value)
      })
    })
  })
})
