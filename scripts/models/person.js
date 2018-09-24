var NonAccumulatingAccount = Models.NonAccumulatingAccount
var AccumulatingAccount = Models.AccumulatingAccount
var TaxCategory = Models.TaxCategory
var PersonDataAdapter = Adapters.PersonDataAdapter
var TaxCalculator = Calculator.TaxCalculator

function Person(age, workingPeriod, retirementLength) {
  this.retirementLength = retirementLength
  this.careerLength = workingPeriod
  this.age = age
  this.accounts = {}
  this.taxCategories = {}
  this.thirdPartyAccounts = {}
  this.expenses = {}
}

Person.prototype.timeIndices = function() {
  var categories = [
    this.accounts,
    this.taxCategories,
    this.thirdPartyAccounts,
    this.expenses
  ]

  var allAccounts = _.reduce(categories, (accumulator, category) => {
    return accumulator.concat(Object.values(category))
  }, [])
  //TODO: This seems excessive to find the maximum time index...
  return _.reduce(allAccounts, (accumulator, account) => {
    return _.uniq(accumulator.concat(account.timeIndices())).sort(( function(a,b) { return a - b } ))
  }, [])
}

Person.prototype.createWorkingPeriod = function(options) {
  var wagesAndCompensation = options.wagesAndCompensation
  var traditional401kContributions = options.traditional401kContributions
  var roth401kContributions = options.roth401kContributions

  var retirementYear = this.age + this.careerLength

  //wages and compensation
  //contributions to various accounts
  //taxes and FICA
  //TODO: calculate interest on accounts
  this.createEmploymentIncome(wagesAndCompensation, this.age, retirementYear)
  this.createTraditional401kContribution(traditional401kContributions, this.age, retirementYear)
  this.createRoth401kContribution(roth401kContributions, this.age, retirementYear)
  this.createFederalInsuranceContributions()
  this.createFederalIncomeWithHolding(this.age, retirementYear)

}

Person.prototype.createSpendDownPeriod = function(options) {
  var retirementYear = this.age + this.careerLength
  var endOfRetirement = retirementYear + options.retirementLength
  var retirementSpending = options.retirementSpending

  _.forEach(_.range(retirementYear + 1, endOfRetirement + 1), (index) => {
    this.retirementWithdrawalsForIndex(index, retirementSpending)
  })

  this.createFederalIncomeWithHolding(retirementYear + 1, endOfRetirement + 1)
}

Person.prototype.retirementWithdrawalsForIndex = function(index, retirementSpending) {
  //spend down strategy:
  // For each year from retirementYear -> end of Retirement
  // 1.) withdraw up to the maximum individual deduction ~12k
  // 2.) withdraw proportionally from the roth and traditional funds to meet
  //     goal

  var traditionalBalance = this.getAccumulatingAccount(
    Constants.TRADITIONAL_401K
  ).getValueAtTime(index)
  var rothBalance = this.getAccumulatingAccount(
    Constants.ROTH_401K
  ).getValueAtTime(index)

  var standardDeductionWithdrawals = this.withdrawalUpToStandardDeduction(
    retirementSpending,
    traditionalBalance,
    rothBalance
  )

  var traditionalWithdrawals = standardDeductionWithdrawals[0]
  var rothWithdrawals = standardDeductionWithdrawals[1]

  //withdraw proporitionally to reach the remainingIncome
  var totalWithdrawals = traditionalWithdrawals + rothWithdrawals
  var remainingIncomeToFill = retirementSpending - totalWithdrawals
  var remainingFundsAvailable = (rothBalance + traditionalBalance) -
    totalWithdrawals

  rothWithdrawals = this.proportionalWithdrawals(
    rothBalance,
    rothWithdrawals,
    remainingIncomeToFill,
    remainingFundsAvailable
  )

  traditionalWithdrawals = this.proportionalWithdrawals(
    traditionalBalance,
    traditionalWithdrawals,
    remainingIncomeToFill,
    remainingFundsAvailable
  )

  this.createTraditionalWithdrawal(traditionalWithdrawals, index, index)
  this.createRothWithdrawal(rothWithdrawals, index, index)
}

Person.prototype.withdrawalUpToStandardDeduction = function(retirementSpending, traditionalBalance, rothBalance) {
  var traditionalWithdrawals = 0
  var rothWithdrawals = 0

  if (retirementSpending > Constants.STANDARD_DEDUCTION) {
    if (traditionalBalance > Constants.STANDARD_DEDUCTION) {
      traditionalWithdrawals = Constants.STANDARD_DEDUCTION
    } else {
      traditionalWithdrawals = traditionalBalance
    }
  }
  else { //retirementSpending < STANDARD_DEDUCTION
    if (traditionalBalance > retirementSpending) {
      traditionalWithdrawals = retirementSpending
    } else { // we don't have enough money to fill spending from trad funds alone
      traditionalWithdrawals =  traditionalBalance
      var gap = retirementSpending - traditionalBalance
      rothWithdrawals = gap > rothBalance ? rothBalance : gap
    }
  }

  return [traditionalWithdrawals, rothWithdrawals]
}

Person.prototype.proportionalWithdrawals = function(balance, withdrawals, incomeToFill, remainingFunds) {
  var updatedWithdrawals = withdrawals
  var proportion = (balance - withdrawals) / remainingFunds
  if ((balance - withdrawals) > 0) {
    var additionalWithdrawals = incomeToFill * proportion

    if (additionalWithdrawals > (balance - withdrawals)) {
      additionalWithdrawals = (balance - withdrawals)
    }

    updatedWithdrawals = withdrawals + additionalWithdrawals
  }
  return updatedWithdrawals
}



Person.prototype.createFlows = function(value, startYear, endYear, sourceAccount, targetAccount) {
  //TODO: Transition to es6 and start using default parameters
  var period = endYear - startYear
  //lodash range is non-inclusive of the "end" parameter
  _.forEach(_.range(startYear, endYear + 1), (timeIndex) => {
    targetAccount.createInFlow(timeIndex, value, sourceAccount)
  })
}

Person.prototype.createEmploymentIncome = function(value, startYear, endYear) {
  var employer = this.getThirdPartyAccount(Constants.EMPLOYER)
  var wages = this.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
  var totalIncome = this.getTaxCategory(Constants.TOTAL_INCOME)

  this.createFlows(value, startYear, endYear, employer, wages)
  this.createFlows(value, startYear, endYear, wages, totalIncome)
}

Person.prototype.createPreTaxBenefits = function(value, startYear, endYear) {
  var sourceAccount = this.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
  var targetAccount = this.getExpense(Constants.PRE_TAX_BENEFITS)

  this.createFlows(value, startYear, endYear, sourceAccount, targetAccount)
}

Person.prototype.createSocialSecurityWageFlows = function() {
  var indexes = this.timeIndices()
  var wages = this.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
  var preTaxBenefits = this.getExpense(Constants.PRE_TAX_BENEFITS)
  var socialSecurityWages = this.getTaxCategory(Constants.SOCIAL_SECURITY_WAGES)

  _.forEach(indexes, (index) => {
    var income = wages.getInFlowValueAtTime(index)
    var benefits = preTaxBenefits.getInFlowValueAtTime(index)

    this.createSocialSecurityWages((income - benefits), index, index, wages, socialSecurityWages)
  })
}

//TODO: Testing for this change
Person.prototype.createRothWithdrawal = function(value, startYear, endYear) {
  var roth401k = this.getAccumulatingAccount(Constants.ROTH_401K)
  var rothWithdrawals = this.getTaxCategory(Constants.ROTH_WITHDRAWALS)
  var totalIncome = this.getTaxCategory(Constants.TOTAL_INCOME)
  this.createFlows(value, startYear, endYear, roth401k, rothWithdrawals)
  this.createFlows(value, startYear, endYear, rothWithdrawals, totalIncome)
}

//TODO: Testing for this change
Person.prototype.createTraditionalWithdrawal = function(value, startYear, endYear) {
  var traditional401k = this.getAccumulatingAccount(Constants.TRADITIONAL_401K)
  var traditionalWithdrawals = this.getTaxCategory(Constants.TRADITIONAL_WITHDRAWAL)
  var totalIncome = this.getTaxCategory(Constants.TOTAL_INCOME)
  this.createFlows(value, startYear, endYear, traditional401k, traditionalWithdrawals)
  this.createFlows(value, startYear, endYear, traditionalWithdrawals, totalIncome)
}

Person.prototype.createFederalIncomeTaxFlows = function(value, startYear, endYear) {
  var sourceAccount = this.getTaxCategory(Constants.TOTAL_INCOME)
  var targetAccount = this.getExpense(Constants.FEDERAL_INCOME_TAX)
  this.createFlows(value, startYear, endYear, sourceAccount, targetAccount)
}

Person.prototype.createFederalIncomeWithHolding = function(startYear, endYear) {
  var indexes = _.range(startYear, endYear + 1)

  var incomes =  [
    this.getTaxCategory(Constants.TRADITIONAL_WITHDRAWAL),
    this.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
  ]

  var deductions = [
    //TODO: add this back once we support traditional IRA deduction
    // this.getAccumulatingAccount(Constants.TRADITIONAL_IRA),
    this.getAccumulatingAccount(Constants.TRADITIONAL_401K)
  ]
  this.getTaxCategory(Constants.WAGES_AND_COMPENSATION).getInFlowValueAtTime(0)
  _.forEach(indexes, (timeIndex) => {
    var totalIncome = _.reduce(incomes, (rollingIncome, account) => {

      return rollingIncome + account.getInFlowValueAtTime(timeIndex)
    }, 0)


    var totalDeductions = _.reduce(deductions, (rollingDeductions, deduction) => {
      return rollingDeductions + deduction.getInFlowValueAtTime(timeIndex)
    }, 0)

    //TODO: Testing for this change
    totalDeductions += Constants.STANDARD_DEDUCTION

    var taxableIncome = totalIncome - totalDeductions
    var federalIncomeTax = TaxCalculator.federalIncomeTax(taxableIncome)

    this.createFederalIncomeTaxFlows(federalIncomeTax, timeIndex, timeIndex)
  })
}

Person.prototype.createFederalInsuranceContributions = function() {
  var indexes = this.timeIndices()
  var wages = this.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
  var preTaxBenefits = this.getExpense(Constants.PRE_TAX_BENEFITS)

  _.forEach(indexes, (timeIndex) => {
    var income = wages.getInFlowValueAtTime (timeIndex)
    var benefits = preTaxBenefits.getInFlowValueAtTime(timeIndex)

    var socialSecurityWages = income - benefits

    var medicareWithholding = TaxCalculator.medicareWithholding(socialSecurityWages)
    var socialSecurityWithholding = TaxCalculator.socialSecurityWithholding(socialSecurityWages)

    this.createMedicareContributions(medicareWithholding, timeIndex, timeIndex)
    this.createSocialSecurityContributions(socialSecurityWithholding, timeIndex, timeIndex)
  })
}

Person.prototype.createMedicareContributions = function(value, startYear, endYear) {
  var sourceAccount = this.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
  var targetAccount = this.getExpense(Constants.MEDICARE)
  this.createFlows(value, startYear, endYear, sourceAccount, targetAccount)
}

Person.prototype.createSocialSecurityContributions = function(value, startYear, endYear) {
  var sourceAccount = this.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
  var targetAccount = this.getExpense(Constants.SOCIAL_SECURITY)
  this.createFlows(value, startYear, endYear, sourceAccount, targetAccount)
}

Person.prototype.createTraditionalIRAContribution = function(value, startYear, endYear) {
  var sourceAccount = this.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
  var targetAccount = this.getAccumulatingAccount(Constants.TRADITIONAL_IRA)

  this.createFlows(value, startYear, endYear, sourceAccount, targetAccount)
}

Person.prototype.createTraditional401kContribution = function(value, startYear, endYear) {
  var sourceAccount = this.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
  var targetAccount = this.getAccumulatingAccount(Constants.TRADITIONAL_401K)

  this.createFlows(value, startYear, endYear, sourceAccount, targetAccount)
}

Person.prototype.createRothIRAContribution = function(value, startYear, endYear) {
  var sourceAccount = this.getTaxCategory(Constants.POST_TAX_INCOME)
  var targetAccount = this.getAccumulatingAccount(Constants.ROTH_IRA)

  this.createFlows(value, startYear, endYear, sourceAccount, targetAccount)
}

Person.prototype.createRoth401kContribution = function(value, startYear, endYear) {
  var sourceAccount = this.getTaxCategory(Constants.POST_TAX_INCOME)
  var targetAccount = this.getAccumulatingAccount(Constants.ROTH_401K)

  this.createFlows(value, startYear, endYear, sourceAccount, targetAccount)
}

Person.prototype.getValue = function(timeIndex) {
  return _.reduce(Object.keys(this.accounts), (value, accountKey) => {
    var account = this.getAccumulatingAccount(accountKey)
    return value + account.getValueAtTime(timeIndex)
  }, 0)
}

Person.prototype.getAccumulatingAccount = function(accountName) {
  this.accounts[accountName] = this.accounts[accountName] || new AccumulatingAccount(accountName)
  return this.accounts[accountName]
}

Person.prototype.getExpense = function(accountName) {
  this.expenses[accountName] = this.expenses[accountName] || new Expense(accountName)
  return this.expenses[accountName]
}

Person.prototype.getThirdPartyAccount = function(accountName) {
  this.thirdPartyAccounts[accountName] = this.thirdPartyAccounts[accountName] || new NonAccumulatingAccount(accountName)
  return this.thirdPartyAccounts[accountName]
}

Person.prototype.getTaxCategory = function(categoryName) {
  this.taxCategories[categoryName] = this.taxCategories[categoryName] || new TaxCategory(categoryName)
  return this.taxCategories[categoryName]
}

Person.prototype.getNetWorthData = function() {
  var timeIndices = this.timeIndices()
  var maxTime = timeIndices[timeIndices.length - 1]

  return PersonDataAdapter.lineChartData(this.accounts, maxTime)
}

Person.prototype.getAccountFlowBalanceByTime = function () {
  var timeIndices = this.timeIndices()
  var maxTime = timeIndices[timeIndices.length - 1]
  var graphableAccounts = _.assign({}, this.accounts, this.expenses)

  return PersonDataAdapter.flowBalanceByTimeData(graphableAccounts, maxTime)
}

Models.Person = Person
