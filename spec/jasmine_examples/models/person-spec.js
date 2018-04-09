var Account = Models.Account
var Person = Models.Person
var CashFlow = Models.CashFlow
var NonAccumulatingAccount = Models.NonAccumulatingAccount
var AccumulatingAccount = Models.AccumulatingAccount
var TaxCategory = Models.TaxCategory


describe('Person', function() {
  var person

  beforeEach(() => {
    person = new Person()
  })

  var accountCreationAndMemoization = function(functionName, accountsIdentifier, clazz) {
    var accountType = 'SomeAccountType'

    it('creates an account if one does not exist', () => {
      expect(person[accountsIdentifier][accountType]).toEqual(undefined)
      person[functionName](accountType)
      expect(person[accountsIdentifier][accountType]).toEqual(jasmine.any(clazz))
    })

    it('uses the pre-existing account of that name if one exists', () => {
      var preExistingAccount = person[functionName](accountType)
      expect(person[functionName](accountType)).toBe(preExistingAccount)
    })
  }

  describe('getAccumulatingAccount', () => {
    accountCreationAndMemoization('getAccumulatingAccount', 'accounts', AccumulatingAccount)
  })

  describe('getThirdPartyAccount', () => {
    accountCreationAndMemoization('getThirdPartyAccount', 'thirdPartyAccounts', NonAccumulatingAccount)
  })

  describe('getTaxCategory', () => {
    accountCreationAndMemoization('getTaxCategory', 'taxCategories', TaxCategory)
  })

  describe('createFlows delegator methods', () => {
    var value = 10000
    var startYear = 0
    var endYear = 30

    var expectCreateFlowsDelegationFromMethod = function(
      functionName,
      sourceClazz,
      sourceMethod,
      sourceConstant,
      targetClazz,
      targetMethod,
      targetConstant
    ) {

      beforeEach(() => {
        spyOn(person, 'createFlows')
      })

      it('should call createFlows with the expected arguments and account types', () => {
        person[functionName](value, startYear, endYear)

        expect(
          person.createFlows
        ).toHaveBeenCalledWith(
          10000,
          0,
          30,
          jasmine.any(sourceClazz),
          jasmine.any(targetClazz)
        )
      })

      describe('find or create account method', () => {

        beforeEach(() => {
          spyOn(person, sourceMethod)
          spyOn(person, targetMethod)
        })

        it('should call the source account method with the expected constant', () => {
          person[functionName](value, startYear, endYear)

          expect(
            person[sourceMethod]
          ).toHaveBeenCalledWith(sourceConstant)
        })
      })
    }

    describe('createEmploymentIncome', () => {
      expectCreateFlowsDelegationFromMethod(
        'createEmploymentIncome',
        NonAccumulatingAccount,
        'getThirdPartyAccount',
        Constants.EMPLOYER,
        TaxCategory,
        'getTaxCategory',
        Constants.WAGES_AND_COMPENSATION
      )
    })

    describe('createTraditionalIRAContribution', () => {
      expectCreateFlowsDelegationFromMethod(
        'createTraditionalIRAContribution',
        TaxCategory,
        'getTaxCategory',
        Constants.WAGES_AND_COMPENSATION,
        AccumulatingAccount,
        'getAccumulatingAccount',
        Constants.TRADITIONAL_IRA
      )
    })

    describe('createRothIRAContribution', () => {
      expectCreateFlowsDelegationFromMethod(
        'createRothIRAContribution',
        TaxCategory,
        'getTaxCategory',
        Constants.POST_TAX_INCOME,
        AccumulatingAccount,
        'getAccumulatingAccount',
        Constants.ROTH_IRA
      )
    })
  })

  describe('createFlows', () => {
    var start = 0
    var end
    var value = 100

    it('should register an flow from the source to the target', () => {
      end = 0
      person.createFlows(
        value,
        start,
        end,
        person.getThirdPartyAccount(Constants.EMPLOYER),
        person.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
      )

      var account = person.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
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
        person.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
      )

      var account = person.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
      _.forEach(_.range(start, end + 1), (time) => {
        var cashFlow = account.contributions[time][0]
        expect(cashFlow).toEqual(jasmine.any(CashFlow))
        expect(cashFlow.getValue()).toEqual(value)
      })
    })

    describe('getAccountValueData', () => {

      beforeEach(() => {
        person.createFlows(
          value,
          start,
          end,
          person.getThirdPartyAccount(Constants.EMPLOYER),
          person.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
        )
      })

      it('should output keys for each account label', () =>{
        //TODO: Remind me what this was for again?
      })
    })
  })
})
