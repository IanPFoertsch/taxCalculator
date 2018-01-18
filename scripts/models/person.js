var Account = Models.Account
var TaxCategory = Models.TaxCategory

function Person() {
  this.accounts = {}
  this.taxCategories = {}
  this.thirdPartyAccounts = {}
  this.employerAccount = this.getThirdPartyAccount('Employer')
}
//a person has accounts
//a person has incomes and expenses

//a person has taxable and non-taxable income
Person.prototype.createFlows = function(value, startYear, endYear, sourceAccount, targetAccount) {
  //TODO: Transition to es6 and start using default parameters
  var period = endYear - startYear
  //lodash range is non-inclusive of the "end" parameter
  _.forEach(_.range(0, period + 1), (timeIndex) => {
    targetAccount.createInFlow(timeIndex, value, sourceAccount)
  })
}

Person.prototype.createEmploymentIncome = function(value, startYear, endYear) {
  var sourceAccount = this.getThirdPartyAccount(Constants.EMPLOYER)
  var targetAccount = this.getAccount(Constants.WAGES_AND_COMPENSATION)

  this.createFlows(value, startYear, endYear, sourceAccount, targetAccount)
}

Person.prototype.createTraditionalIRAContribution = function(value, startYear, endYear) {
  var sourceAccount = this.getAccount(Constants.WAGES_AND_COMPENSATION)
  var targetAccount = this.getAccount(Constants.TRADITIONAL_IRA)

  this.createFlows(value, startYear, endYear, sourceAccount, targetAccount)
}

Person.prototype.createRothIRAContribution = function(value, startYear, endYear) {
  var sourceAccount = this.getAccount(Constants.POST_TAX_INCOME)
  var targetAccount = this.getAccount(Constants.ROTH_IRA)

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

Person.prototype.getValue = function(timeIndex) {
  return _.reduce(Object.keys(this.accounts), (value, accountKey) => {
    var account = this.getAccount(accountKey)

    return value + account.getValue(timeIndex)
  }, 0)
}

Person.prototype.getAccount = function(accountName) {
  this.accounts[accountName] = this.accounts[accountName] || new Account(accountName)
  return this.accounts[accountName]
}

Person.prototype.getThirdPartyAccount = function(accountName) {
  this.thirdPartyAccounts[accountName] = this.thirdPartyAccounts[accountName] || new Account(accountName)
  return this.thirdPartyAccounts[accountName]
}

Person.prototype.getTaxCategory = function(categoryName) {
  this.taxCategories[categoryName] = this.taxCategories[categoryName] || new TaxCategory(categoryName)
  return this.taxCategories[categoryName]
}

Models.Person = Person
