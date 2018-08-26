'use-strict'
var Person = Models.Person

function PersonService(personListener) {
  this.listener = personListener
}

PersonService.prototype.getListenerInput = function(constant) {
  return this.listener.getInput(constant)
}

PersonService.prototype.createEmploymentIncome = function(person) {
  const wages = this.getListenerInput(Constants.WAGES_AND_COMPENSATION)
  const careerLength = this.getListenerInput(Constants.CAREER_LENGTH)
  person.createEmploymentIncome(wages, 0, careerLength)
}

PersonService.prototype.createPreTaxRetirementContributions = function(person) {
  const careerLength = this.getListenerInput(Constants.CAREER_LENGTH)
  const iraContributions = this.getListenerInput(Constants.TRADITIONAL_IRA_CONTRIBUTIONS)

  const _401kContributions = this.getListenerInput(Constants.TRADITIONAL_401K_CONTRIBUTIONS)

  person.createTraditionalIRAContribution(iraContributions, 0, careerLength)
  person.createTraditional401kContribution(_401kContributions, 0, careerLength)
}

PersonService.prototype.createRothRetirementContributions = function(person) {
  const contributions = this.getListenerInput(Constants.ROTH_IRA_CONTRIBUTIONS)
  const _401kContributions = this.getListenerInput(Constants.ROTH_401K_CONTRIBUTIONS)

  const careerLength = this.getListenerInput(Constants.CAREER_LENGTH)
  person.createRothIRAContribution(contributions, 0, careerLength)
  person.createRoth401kContribution(_401kContributions, 0, careerLength)
}

PersonService.prototype.createPreTaxBenefits = function(person) {
  // const benefits = this.getListenerInput(Constants.PRE_TAX_BENEFITS)
  // const careerLength = this.getListenerInput(Constants.CAREER_LENGTH)
  // person.createPreTaxBenefits(benefits, 0, careerLength)
}

PersonService.prototype.buildPerson = function() {
  var person = new Person(
    this.getListenerInput(Constants.AGE),
    this.getListenerInput(Constants.CAREER_LENGTH),
    this.getListenerInput(Constants.RETIREMENT_LENGTH)
  )
  // Tax deferred contributions
  // federal income tax
  // state income tax
  // whatever other taxes
  // flow remainder from wages and compensation to "net post tax income"
  // Roth Contributions
  // After-tax contributions
  // Expenses
  // Brokerage
  person.createWorkingPeriod({
    wagesAndCompensation: this.getListenerInput(Constants.WAGES_AND_COMPENSATION),
    roth401kContributions: this.getListenerInput(Constants.ROTH_401K_CONTRIBUTIONS),
    traditional401kContributions: this.getListenerInput(Constants.TRADITIONAL_401K_CONTRIBUTIONS)
  })

  person.createSpendDownPeriod({
    retirementLength: this.getListenerInput(Constants.RETIREMENT_LENGTH),
    retirementSpending: this.getListenerInput(Constants.RETIREMENT_SPENDING)
  })
  // this.createEmploymentIncome(person)
  // this.createTaxableWithdrawals(person)
  // this.createPreTaxBenefits()
  //FICA EXEMPT HSA CONTRIBUTIONS
  //spend-down strategies
  //build person's working career and retirement period
  //build contributions to retirement accounts
  //calculate interest to accounts
  //build withdrawals from accounts
  //calculate taxes
  // person.createFederalInsuranceContributions()
  // this.createPreTaxRetirementContributions(person)
  // person.createFederalIncomeWithHolding()
  // this.createRothRetirementContributions(person)
  return person
}


Services.PersonService = PersonService
