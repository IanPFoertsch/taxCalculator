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

  person.createTraditionalIRAContribution(iraContributions, 0, careerLength)
}

PersonService.prototype.createRothRetirementContributions = function(person) {
  const contributions = this.getListenerInput(Constants.ROTH_IRA_CONTRIBUTIONS)
  const careerLength = this.getListenerInput(Constants.CAREER_LENGTH)
  person.createRothIRAContribution(contributions, 0, careerLength)
}

PersonService.prototype.createPreTaxBenefits = function(person) {
  // const benefits = this.getListenerInput(Constants.PRE_TAX_BENEFITS)
  // const careerLength = this.getListenerInput(Constants.CAREER_LENGTH)
  // person.createPreTaxBenefits(benefits, 0, careerLength)
}

PersonService.prototype.buildPerson = function() {
  var person = new Person(this.getListenerInput(Constants.AGE))

  //TODO: figure out a way to do this which isn't so order-dependant
  // Order matters, so we need to create things in sequence:
  // Wages and Compensation

  // Tax deferred contributions
  // federal income tax
  // state income tax
  // whatever other taxes
  // flow remainder from wages and compensation to "net post tax income"
  // Roth Contributions
  // After-tax contributions
  // Expenses
  // Brokerage
  this.createEmploymentIncome(person)
  this.createPreTaxBenefits()
  //FICA EXEMPT HSA CONTRIBUTIONS
  person.createSocialSecurityWageFlows()
  person.createFederalInsuranceContributions()

  this.createPreTaxRetirementContributions(person)

  person.createFederalIncomeWithHolding()

  this.createRothRetirementContributions(person)

  //create post-tax retirement contributions
  return person
}


Services.PersonService = PersonService
