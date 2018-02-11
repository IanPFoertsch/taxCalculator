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

PersonListener.prototype.getInput = function() {
  var person = new Person(this.listeners.Age.getInput())

  person.createEmploymentIncome(this.listeners['Gross Income'].getInput(), 0, 30)
  person.createTraditionalIRAContribution(this.listeners['Traditional Contributions'].getInput(), 0, 30)

  return _.reduce(this.listeners, function(person, listener) {

    person[listener.outputLabel()] = listener.getInput()
    return person
  }, {})
}
