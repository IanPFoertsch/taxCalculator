
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

      beforeEach(() => {
        listenerStubHash[Constants.WAGES_AND_COMPENSATION] = wages
        listenerStubHash[Constants.CAREER_LENGTH] = careerLength
      })

      it('builds a person with the specified employment income', () => {
        spyOn(Person.prototype, 'createEmploymentIncome')
        service.buildPerson()
        expect(
          Person.prototype.createEmploymentIncome
        ).toHaveBeenCalledWith(wages, 0, careerLength)
      })

      it('creates federal insurance contributions on the person', () => {
        spyOn(Person.prototype, 'createFederalInsuranceContributions')
        service.buildPerson()
        expect(
          Person.prototype.createFederalInsuranceContributions
        ).toHaveBeenCalledWith()
      })

      describe('with ', () => {

      })
    })
  })
})
