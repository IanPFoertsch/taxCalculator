document.addEventListener('DOMContentLoaded', function() {
  var inputRows = [
    { label: Constants.WAGES_AND_COMPENSATION, type: 'number', default: 50000 },
    { label: Constants.TRADITIONAL_IRA_CONTRIBUTIONS, type: 'number', default: 5000},
    { label: Constants.ROTH_IRA_CONTRIBUTIONS, type: 'number', default: 2000},
    // { label: 'Brokerage Investments', type: 'number', default: 1000},
    { label: Constants.CAREER_LENGTH, type: 'number', default: 20},
    { label: Constants.AGE, type: 'number', default: 30},
    { label: 'Retirement Spending', type: 'number', default: 10000},
    { label: 'Retirement Length', type: 'number', default: 30},
  ]

  var inputTable =  new InputTableElement({
    cssClasses: ['person-table'],
    titleRow: { title: 'Enter Your Financial Information' },
    rows: inputRows
  }, '.left-bar')

  var personListener = new PersonListener(inputRows)

  var netWorthChart = new ChartHolder({
    cssClasses: ['chart-holder'],
    canvas: { type: 'line'},
    updateFunction: function(personListener) {
      return function(chart) {
        var personService = new PersonService(personListener)
        var person = personService.buildPerson()

        this.update(person.getNetWorthData())
      }
    }(personListener)
  }, '.main')

  var cashFlowChart = new ChartHolder({
    cssClasses: ['chart-holder'],
    canvas: { type: 'bar'},
    updateFunction: function(personListener) {
      return function(chart) {
        var personService = new PersonService(personListener)
        var person = personService.buildPerson()
        this.update(person.getAccountFlowBalanceByTime())
      }
    }(personListener)
  }, '.main')


  var calculateProjection = function(personListener, charts) {
    return () => {
      var personService = new PersonService(personListener)
      var person = personService.buildPerson()
      var accountProjection = person.getNetWorthData()
      _.each(charts, (chart) => {
        chart.update(accountProjection)
      })
    }
  }

  var projectionButton = new Button({
    text: 'Project Income',
    onClick: function() {

      _.each([netWorthChart, cashFlowChart], (chartHolder) => {
        chartHolder.updateFunction()
      })
    }
  }, '.main')

  //Prepare and populate the DOM
  var prepareables = [
    projectionButton,
    inputTable,
    netWorthChart,
    cashFlowChart
  ]

  _.each(prepareables, (prepareable) => {
    prepareable.prepare()
  })

  //TODO: this is a duplication of the update logic - remove me
  var updateables = [
    netWorthChart,
    cashFlowChart
  ]

  _.each(updateables, (updateable) => {
    updateable.updateFunction()
  })
})
