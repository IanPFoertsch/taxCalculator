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

PersonService.prototype.createTraditionalIRAContribution = function(person) {
  const contributions = this.getListenerInput(Constants.TRADITIONAL_CONTRIBUTIONS)
  const careerLength = this.getListenerInput(Constants.CAREER_LENGTH)
  person.createTraditionalIRAContribution(contributions, 0, careerLength)
}

PersonService.prototype.createRothIRAContribution = function(person) {
  const contributions = this.getListenerInput(Constants.ROTH_CONTRIBUTIONS)
  const careerLength = this.getListenerInput(Constants.CAREER_LENGTH)
  person.createRothIRAContribution(contributions, 0, careerLength)
}

PersonService.prototype.createFederalIncomeTaxFlows = function(person) {
  const careerLength = this.getListenerInput(Constants.CAREER_LENGTH)
  // for every year in the career, get the value of the WAGES_AND_COMPENSATION,
  //
}


PersonService.prototype.buildPerson = function() {
  var person = new Person(this.getListenerInput(Constants.AGE))

  //TODO: figure out a way to do this which isn't so order-dependant
  // Order matters, so we need to create things in sequence:
  // Wages and Compensation

  // medicare
  // social security
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
  // FICA exempt HSA contributions
  person.createFederalInsuranceContributions()
  this.createTraditionalIRAContribution(person)
  this.createFederalIncomeTaxFlows(person)
  this.createRothIRAContribution(person)
  return person
}


Services.PersonService = PersonService
