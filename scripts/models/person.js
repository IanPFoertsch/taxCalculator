var NonAccumulatingAccount = Models.NonAccumulatingAccount
var AccumulatingAccount = Models.AccumulatingAccount
var TaxCategory = Models.TaxCategory
var PersonDataAdapter = Adapters.PersonDataAdapter
var TaxCalculator = Calculator.TaxCalculator

function Person(age) {
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

Person.prototype.createFlows = function(value, startYear, endYear, sourceAccount, targetAccount) {
  //TODO: Transition to es6 and start using default parameters
  var period = endYear - startYear
  //lodash range is non-inclusive of the "end" parameter
  _.forEach(_.range(startYear, endYear + 1), (timeIndex) => {
    targetAccount.createInFlow(timeIndex, value, sourceAccount)
  })
}

Person.prototype.createEmploymentIncome = function(value, startYear, endYear) {
  var sourceAccount = this.getThirdPartyAccount(Constants.EMPLOYER)
  var targetAccount = this.getTaxCategory(Constants.WAGES_AND_COMPENSATION)

  this.createFlows(value, startYear, endYear, sourceAccount, targetAccount)
}

Person.prototype.createFederalInsuranceContributions = function() {
  var indexes = this.timeIndices()
  var wages = this.getTaxCategory(Constants.WAGES_AND_COMPENSATION)

  _.forEach(indexes, (timeIndex) => {
    var income = wages.getValueAtTime(timeIndex)
    var medicareWithholding = TaxCalculator.medicareWithholding(income)

    this.createMedicareContributions(medicareWithholding, timeIndex, timeIndex)
  })
}

Person.prototype.createMedicareContributions = function(value, startYear, endYear) {
  var sourceAccount = this.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
  var targetAccount = this.getExpense(Constants.MEDICARE)
  this.createFlows(value, startYear, endYear, sourceAccount, targetAccount)
}

Person.prototype.createTraditionalIRAContribution = function(value, startYear, endYear) {
  var sourceAccount = this.getTaxCategory(Constants.WAGES_AND_COMPENSATION)
  var targetAccount = this.getAccumulatingAccount(Constants.TRADITIONAL_IRA)

  this.createFlows(value, startYear, endYear, sourceAccount, targetAccount)
}

Person.prototype.createRothIRAContribution = function(value, startYear, endYear) {
  var sourceAccount = this.getTaxCategory(Constants.POST_TAX_INCOME)
  var targetAccount = this.getAccumulatingAccount(Constants.ROTH_IRA)

  this.createFlows(value, startYear, endYear, sourceAccount, targetAccount)
}

Person.prototype.getAccountValueData = function() {
  //from current age to end of time, format the account value data
  //as 'Account Label': [{x: timeIndex, y: accountValue}, {...}, {...}]
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
