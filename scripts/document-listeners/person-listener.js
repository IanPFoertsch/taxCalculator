var Person = Models.Person

function PersonListener(rows) {
  this.listeners = _.reduce(rows, function(memo, config) {
    if (config.type === 'number') {
      memo[config.label] = new NumericInputListener(config)
    } else {
      memo[config.label] = new InputListener(config)
    }
    return memo
  }, {})
}

PersonListener.prototype.getListener = function(label) {
  return this.listeners[label]
}

PersonListener.prototype.createEmploymentIncome = function(person) {
  const wages = this.getListener(Constants.WAGES_AND_COMPENSATION).getInput()
  const careerLength = this.getListener(Constants.CAREER_LENGTH).getInput()
  person.createEmploymentIncome(wages, 0, careerLength)
}

PersonListener.prototype.createTraditionalIRAContribution = function(person) {
  const contributions = this.getListener(Constants.TRADITIONAL_CONTRIBUTIONS).getInput()
  const careerLength = this.getListener(Constants.CAREER_LENGTH).getInput()
  person.createTraditionalIRAContribution(contributions, 0, careerLength)
}

PersonListener.prototype.createRothIRAContribution = function(person) {
  const contributions = this.getListener(Constants.ROTH_CONTRIBUTIONS).getInput()
  const careerLength = this.getListener(Constants.CAREER_LENGTH).getInput()
  person.createRothIRAContribution(contributions, 0, careerLength)
}

PersonListener.prototype.buildPerson = function() {
  var person = new Person(this.listeners.Age.getInput())
  this.createEmploymentIncome(person)
  this.createTraditionalIRAContribution(person)
  this.createRothIRAContribution(person)


  return person
}
