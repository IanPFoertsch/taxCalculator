var NonAccumulatingAccount = Models.NonAccumulatingAccount
var AccumulatingAccount = Models.AccumulatingAccount
var TaxCategory = Models.TaxCategory
var PersonDataAdapter = Adapters.PersonDataAdapter
var TaxCalculator = Calculator.TaxCalculator
var WithdrawalCalculator = Calculator.WithdrawalCalculator

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
  var traditionalBalance = this.getAccumulatingAccount(
    Constants.TRADITIONAL_401K
  ).getValueAtTime(index)
  var rothBalance = this.getAccumulatingAccount(
    Constants.ROTH_401K
  ).getValueAtTime(index)
  var taxableIncome = this.taxableIncomeForIndex(index)

  var traditionalWithdrawals = WithdrawalCalculator.withdrawalUpToStandardDeductionFromTraditional(
    taxableIncome,
    retirementSpending,
    traditionalBalance
  )

  var rothWithdrawals = 0

  //withdraw proporitionally to reach the remainingIncome
  var totalWithdrawals = traditionalWithdrawals
  var remainingIncomeToFill = retirementSpending - totalWithdrawals
  var remainingFundsAvailable = (rothBalance + traditionalBalance) -
    totalWithdrawals

  var traditionalIncomeGoal = WithdrawalCalculator.proportionalWithdrawals(
    traditionalBalance,
    traditionalWithdrawals,
    remainingIncomeToFill,
    remainingFundsAvailable
  )

  var remainingTraditionalIncomeToFill = traditionalIncomeGoal - traditionalWithdrawals

  var traditionalWithdrawalsToGoal = WithdrawalCalculator.traditionalWithdrawalsToGoal(
    0, //Refactor out this parameter we don't end up needing
    0, //Replace this with current taxable income pre-withdrawals
    remainingTraditionalIncomeToFill
  )

  if ((traditionalWithdrawals + traditionalWithdrawalsToGoal) > traditionalBalance) {
    traditionalWithdrawals = traditionalBalance
  } else {
    traditionalWithdrawals = traditionalWithdrawals + traditionalWithdrawalsToGoal
  }
  
  this.createTraditionalWithdrawal(traditionalWithdrawals, index, index)
  var updatedTaxableIncome = this.taxableIncomeForIndex(index)

  var netIncome = updatedTaxableIncome - TaxCalculator.federalIncomeTax(updatedTaxableIncome)

  remainingIncomeToFill = remainingIncomeToFill - netIncome

  if(remainingIncomeToFill > rothBalance) {
    rothWithdrawals = rothBalance
  } else {
    rothWithdrawals = remainingIncomeToFill
  }


  this.createRothWithdrawal(rothWithdrawals - netIncome, index, index)
}

Person.prototype.createFlows = function(value, startYear, endYear, sourceAccount, targetAccount) {
  //TODO: Transition to es6 and start using default parameters
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


  _.forEach(indexes, (timeIndex) => {
    var taxableIncome = this.taxableIncomeForIndex(timeIndex)
    var federalIncomeTax = TaxCalculator.federalIncomeTax(taxableIncome)

    this.createFederalIncomeTaxFlows(federalIncomeTax, timeIndex, timeIndex)
  })
}

//TODO: unit testing for this change
Person.prototype.taxableIncomeForIndex = function(timeIndex) {
  //TODO: extract this to a class constant or something more efficient
  var incomes =  [
    this.getTaxCategory(Constants.TRADITIONAL_WITHDRAWAL),
    this.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
  ]

  var deductions = [
    //TODO: add this back once we support traditional IRA deduction
    // this.getAccumulatingAccount(Constants.TRADITIONAL_IRA),
    this.getAccumulatingAccount(Constants.TRADITIONAL_401K)
  ]

  var totalIncome = _.reduce(incomes, (rollingIncome, account) => {
    return rollingIncome + account.getInFlowValueAtTime(timeIndex)
  }, 0)


  var totalDeductions = _.reduce(deductions, (rollingDeductions, deduction) => {
    return rollingDeductions + deduction.getInFlowValueAtTime(timeIndex)
  }, 0)

  totalDeductions += Constants.STANDARD_DEDUCTION
  var taxableIncome = (totalIncome - totalDeductions)

  return taxableIncome < 0 ? 0 : taxableIncome
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
