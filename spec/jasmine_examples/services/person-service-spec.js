
var PersonService = Services.PersonService
var Person = Models.Person

describe('PersonService', function() {
  var listener
  var service
  var listenerStubHash = {}

  beforeEach(() => {
    listener = { getInput: function(arg) {
      return listenerStubHash[arg] }
    }
    service = new PersonService(listener)

  })

  describe('getListenerInput', () => {
    var constant = 'SOME CONSTANT'

    beforeEach(() => {
      spyOn(listener, 'getInput')
    })

    it('queries the listener with the constant', () => {
      service.getListenerInput(constant)
      expect(listener.getInput).toHaveBeenCalledWith(constant)
    })
  })

  describe('buildPerson', () => {
    var ageValue = 30

    beforeEach(() => {
      listenerStubHash[Constants.AGE] = ageValue
    })

    it('builds a person with the listeners age', () => {
      var person = service.buildPerson()
      expect(person.age).toEqual(ageValue)
    })

    describe('with employment', () => {
      var wages = 50000
      var careerLength
      var age = 30
      var retirementLength = 20
      var roth401kContributions = 2000
      var traditional401kContributions = 3000
      var retirementSpending = 10000

      beforeEach(() => {
        listenerStubHash[Constants.WAGES_AND_COMPENSATION] = wages
        listenerStubHash[Constants.CAREER_LENGTH] = careerLength
        listenerStubHash[Constants.AGE] = age
        listenerStubHash[Constants.RETIREMENT_LENGTH] = retirementLength
        listenerStubHash[Constants.ROTH_401K_CONTRIBUTIONS] = roth401kContributions
        listenerStubHash[Constants.TRADITIONAL_401K_CONTRIBUTIONS] = traditional401kContributions
        listenerStubHash[Constants.RETIREMENT_SPENDING] = retirementSpending
      })

      it('creates a person with the specified age, career length and retirement length', () => {
        spyOn(Person.prototype, 'createEmploymentIncome')
        var person = service.buildPerson()
        expect(person.age).toEqual(age)
        expect(person.careerLength).toEqual(careerLength)
        expect(person.retirementLength).toEqual(retirementLength)
      })

      it('creates a working period with the specified wages and contributions', () => {
        spyOn(Person.prototype, 'createWorkingPeriod')
        service.buildPerson()
        expect(
          Person.prototype.createWorkingPeriod
        ).toHaveBeenCalledWith({
          wagesAndCompensation: wages,
          roth401kContributions: roth401kContributions,
          traditional401kContributions: traditional401kContributions
        })
      })

      it('creates a spend down period with the specified retirement spending', () => {
        spyOn(Person.prototype, 'createSpendDownPeriod')
        service.buildPerson()
        expect(
          Person.prototype.createSpendDownPeriod
        ).toHaveBeenCalledWith({
          retirementLength: retirementLength,
          retirementSpending: retirementSpending
        })
      })
    })
  })
})
