var Account = Models.Account

function Person() {
  this.accounts = {}
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
    targetAccount.createContribution(timeIndex, value, sourceAccount)
  })
}

Person.prototype.createEmploymentIncome = function(value, startYear, endYear) {
  var sourceAccount = this.getThirdPartyAccount(Constants.EMPLOYER)
  var targetAccount = this.getAccount(Constants.WAGES_AND_COMPENSATION)

  this.createFlows(value, startYear, endYear, sourceAccount, targetAccount)
}

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

Person.prototype.getNetIncome = function(year) {
  return this.getAccount(Constants.NET_INCOME).getValueAtYear(year)
}


Person.prototype.getValue = function() {
  return _.reduce(Object.keys(this.accounts), (value, accountKey) => {
    var account = this.getAccount(accountKey)

    return value + account.getValue()
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

// Person.prototype.createEmploymentIncome = function(value, startYear, endYear) {
//
// }


Models.Person = Person
