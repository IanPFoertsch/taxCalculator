var NonAccumulatingAccount = Models.NonAccumulatingAccount
var AccumulatingAccount = Models.AccumulatingAccount
var TaxCategory = Models.TaxCategory
var PersonDataAdapter = Adapters.PersonDataAdapter

function Person(age) {
  this.age = age
  this.accounts = {}
  this.taxCategories = {}
  this.thirdPartyAccounts = {}
}

Person.prototype.timeIndices = function() {
  var categories = [this.accounts, this.taxCategories, this.thirdPartyAccounts]

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

Person.prototype.createFederalIncomeTaxFlows = function(value, startYear, endYear) {
  //Need the "Non-Accumulating Account" concept
  //The WAGES_AND_COMPENSATION account is non-accumulating. That is - there is
  //no accumulating value.
}

//create inflows to different accounts
//create flows from those accounts to different taxable categories
//create deductable flows
//create tax flows outwards
//create create post tax contribution flows
//create residual spending flows


Person.prototype.createTaxFlows = function() {
  //here - for every year we have a wages and compensation value,
  //create the following flows:

  // medicare
  // social security
  // federal income tax
  // state income tax
  // whatever other taxes
  // then a flow for the remainder from wages and Compensation
  // to a "net post tax income account"
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

Models.Person = Person
