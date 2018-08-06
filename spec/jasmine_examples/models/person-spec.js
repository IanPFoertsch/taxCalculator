var Account = Models.Account
var Expense = Models.Expense
var Person = Models.Person
var CashFlow = Models.CashFlow
var NonAccumulatingAccount = Models.NonAccumulatingAccount
var AccumulatingAccount = Models.AccumulatingAccount
var TaxCategory = Models.TaxCategory
var PersonDataAdapter = Adapters.PersonDataAdapter
var TaxCalculator = Calculator.TaxCalculator

describe('Person', function() {
  var person

  beforeEach(() => {
    person = new Person()
  })

  describe('timeIndices', () => {
    var account

    beforeEach(() => {
      person.createEmploymentIncome(1000, 0, 10)
      account = person.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
    })

    it('queries the accounts for their timeIndices', () => {
      spyOn(account, 'timeIndices')
      person.timeIndices()
      expect(account.timeIndices).toHaveBeenCalledWith()
    })

    it('returns a list of time indexes from the longest account projection', () => {
      var indexes = person.timeIndices()
      expect(indexes).toEqual(account.timeIndices())
    })

    describe('with multiple account projection maximum times', () => {
      beforeEach(() => {
        person.createTraditionalIRAContribution(1000, 5, 17)
      })

      it('includes indexes stretching from the minimum to the maximum', () => {
        var indexes = person.timeIndices()

        expect(indexes).toEqual(
          [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
        )
      })
    })
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

  describe('getExpense', () => {
    accountCreationAndMemoization('getExpense', 'expenses', Expense)
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
          value,
          startYear,
          endYear,
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

        it('should call the target account method with the expected constant', () => {
          person[functionName](value, startYear, endYear)

          expect(
            person[targetMethod]
          ).toHaveBeenCalledWith(targetConstant)
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

    describe('createMedicareContributions', () => {
      expectCreateFlowsDelegationFromMethod(
        'createMedicareContributions',
        TaxCategory,
        'getTaxCategory',
        Constants.WAGES_AND_COMPENSATION,
        Expense,
        'getExpense',
        Constants.MEDICARE
      )
    })

    describe('createFederalIncomeTaxFlows', () => {
      expectCreateFlowsDelegationFromMethod(
        'createFederalIncomeTaxFlows',
        TaxCategory,
        'getTaxCategory',
        Constants.TAXABLE_INCOME,
        Expense,
        'getExpense',
        Constants.FEDERAL_INCOME_TAX
      )
    })
  })

  var setupExpenseContribution = function(functionName, expenseIdentifier, expectedExpense, maxTime) {
    it('creates in income tax contribution for each year with income', () => {
      person[functionName]()

      var expense = person.getExpense(expenseIdentifier)
      _.forEach(_.range(0, maxTime + 1), (index) => {
        var contribution = expense.contributions[index][0]
        expect(contribution.value).toEqual(expectedExpense)
      })
    })
  }

  var delegatesToTheTaxCalculator = function(functionName, taxCategoryName, delegatedMethod) {
    it('delgates to the tax calculator based on the incoming value to the tax category', () => {
      var inflowValueAtTime = 99999
      var wages_account = person.getTaxCategory(taxCategoryName)
      spyOn(wages_account, 'getInFlowValueAtTime').and.returnValue(inflowValueAtTime)
      person[functionName]()
      expect(TaxCalculator[delegatedMethod]).toHaveBeenCalledWith(inflowValueAtTime)
    })
  }

  var createsFlowsForEachYearOfIncome = function(methodUnderTest, flowMethod, maxTime, testAmount) {
    it('creates a flow for each year of income', () => {

      spyOn(person, flowMethod)
      person[methodUnderTest]()
      _.forEach(_.range(0, maxTime + 1), (index) => {
        expect(person[flowMethod]).toHaveBeenCalledWith(testAmount, index, index)
      })
    })
  }



  describe('createFederalIncomeWithHolding', () => {
    var income = 100000
    var maxTime = 10
    var federalIncomeTax = 20000

    beforeEach(()=> {
      person.createEmploymentIncome(income, 0, maxTime)
      person.createTraditionalIRAContribution(income, 0, maxTime)
      spyOn(TaxCalculator, 'federalIncomeTax').and.returnValue(federalIncomeTax)
    })

    delegatesToTheTaxCalculator(
      'createFederalIncomeWithHolding',
      Constants.WAGES_AND_COMPENSATION,
      'federalIncomeTax'
    )

    setupExpenseContribution(
      'createFederalIncomeWithHolding',
      Constants.FEDERAL_INCOME_TAX,
      federalIncomeTax,
      maxTime
    )

    createsFlowsForEachYearOfIncome(
      'createFederalIncomeWithHolding',
      'createFederalIncomeTaxFlows',
      maxTime,
      federalIncomeTax
    )
  })

  describe('createFederalInsuranceContributions', () => {
    var income = 100000
    var maxTime = 10
    var medicareWithholding = 5000
    var socialSecurityWithholding = 6000

    beforeEach(()=> {
      person.createEmploymentIncome(income, 0, maxTime)
      spyOn(TaxCalculator, 'medicareWithholding').and.returnValue(medicareWithholding)
      spyOn(TaxCalculator, 'socialSecurityWithholding').and.returnValue(socialSecurityWithholding)
    })

    delegatesToTheTaxCalculator(
      'createFederalInsuranceContributions',
      Constants.WAGES_AND_COMPENSATION,
      'medicareWithholding'
    )

    delegatesToTheTaxCalculator(
      'createFederalInsuranceContributions',
      Constants.WAGES_AND_COMPENSATION,
      'socialSecurityWithholding'
    )

    setupExpenseContribution(
      'createFederalInsuranceContributions',
      Constants.MEDICARE,
      medicareWithholding,
      maxTime
    )

    setupExpenseContribution(
      'createFederalInsuranceContributions',
      Constants.SOCIAL_SECURITY,
      socialSecurityWithholding,
      maxTime
    )

    createsFlowsForEachYearOfIncome(
      'createFederalInsuranceContributions',
      'createMedicareContributions',
      maxTime,
      medicareWithholding
    )

    createsFlowsForEachYearOfIncome(
      'createFederalInsuranceContributions',
      'createSocialSecurityContributions',
      maxTime,
      socialSecurityWithholding
    )
  })

  describe('createFlows', () => {
    var start = 0
    var end
    var value = 100

    it('should register a flow from the source to the target', () => {
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

    describe('for years starting not at 0', () => {
      it('should begin the flows at the specified start year', () => {
        start = 10
        end = 20
        person.createFlows(
          value,
          start,
          end,
          person.getThirdPartyAccount(Constants.EMPLOYER),
          person.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
        )

        var account = person.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
        var keys = Object.keys(account.contributions)

        expect(parseInt(keys[0])).toEqual(start)
        expect(parseInt(keys[10])).toEqual(end)
      })
    })
  })

  describe('getAccountFlowBalanceByTime', () => {
    var value = 10000
    var start = 0
    var end = 10
    beforeEach(() => {
      person.createEmploymentIncome(value, start, end)
      person.createFederalInsuranceContributions()
    })

    it('queries the PersonDataAdapter for the flowBalanceByTimeData with the accumulating accounts and expenses', () =>{
      spyOn(PersonDataAdapter, 'flowBalanceByTimeData')
      person.getAccountFlowBalanceByTime()
      var graphableAccounts = _.assign({}, person.accounts, person.expenses)
      expect(PersonDataAdapter.flowBalanceByTimeData).toHaveBeenCalledWith(graphableAccounts, end)
    })
  })

  describe('getNetWorthData', () => {
    let timeIndices
    let accounts
    beforeEach(() => {
      timeIndices = [0, 1, 2, 3]
      accounts = {}
      spyOn(PersonDataAdapter, 'lineChartData')
      spyOn(person, 'timeIndices').and.returnValue(timeIndices)
    })

    it('queries the time indices', () => {
      person.getNetWorthData()
      expect(person.timeIndices).toHaveBeenCalledWith()
    })

    it('queries the PersonDataAdapter', () => {
      person.accounts = accounts
      person.getNetWorthData()
      expect(PersonDataAdapter.lineChartData).toHaveBeenCalledWith(accounts, 3)
    })
  })
})
