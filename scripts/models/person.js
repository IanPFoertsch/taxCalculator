var Account = Models.Account

function Person() {
  this.incomes = []
  this.expenses = []
  this.accounts = {}
  this.employerAccount = new Account('Employer')
}
//a person has accounts
//a person has incomes and expenses

//a person has taxable and non-taxable income
Person.prototype.createIncome = function(value, startYear, endYear, source, target) {
  sourceAccount = this.getAccount(source)
  targetAccount = this.getAccount(target)
  //TODO: Transition to es6 and start using default parameters
  period = endYear - startYear
  //lodash range is non-inclusive of the "end" parameter
  _.forEach(_.range(0, period + 1), (timeIndex) => {
    targetAccount.createContribution(timeIndex, value, sourceAccount)
  })
}

Person.prototype.createExpense = function(value, startYear, endYear, source, target) {
  sourceAccount = this.getAccount(source)
  targetAccount = this.getAccount(target)
  //TODO: Transition to es6 and start using default parameters
  period = endYear - startYear
  //lodash range is non-inclusive of the "end" parameter
  _.forEach(_.range(0, period + 1), (timeIndex) => {
    targetAccount.createContribution(timeIndex, value, sourceAccount)
  })
}


Person.prototype.getAccount = function(accountName) {
  this.accounts[accountName] = this.accounts[accountName] || new Account(accountName)
  return this.accounts[accountName]
}

// Person.prototype.createEmploymentIncome = function(value, startYear, endYear) {
//
// }


Models.Person = Person
