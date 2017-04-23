function i() {}

PersonListener.prepare = function(tableElement) {
  //Updates DOM with person information input table
  //   <input type="number" id="grossIncome"></input>
  //   <button id="calculateButton">Calculate your Taxes</button>
  //   <label for="yearlyInvestment">Yearly Investment</label>
  //   <input type="number" id="yearlyInvestment" ></input>
  //   <label for="yearsToRetirement">Years To Retirment</label>
  //   <input type="number" id="yearsToRetirement"></input>
  //   <label for="deductableContributions">Deductable Contributions</label>
  //   <input type="number" id="defuctableContributions"></input>

  //inputs=grossIncome, years to retirement, Traditional and Roths contributions,
  //  brokerage investments

  //input element = inputelementbox with label and input types

  var toCamelCase = function(string) {
    var items = string.split(' ');
    var rest = items.slice(1, items.length);
    var first = items[0].toLowerCase();

    remainder = _.reduce(rest, function(string, item) {
      var lowerCased =  item.toLowerCase();
      var upper = lowerCased[0].toUpperCase();
      var camelCased = upper + lowerCased.slice(1, lowerCased.length);
      return string + camelCased;
    }, '');

    return first + remainder;
  };

  var toSpaced = function(string) {
    if (string.length === 0) {
      return string;
    } else {
      var split = string.split(/(?=[A-Z])/);
      var upperCased = _.map(split, function(item) {
        return item[0].toUpperCase() + item.slice(1);
      });
      return upperCased.join(' ');
    }
  };

  var labels = [
    'Gross Income',
    'Deductable Contributions',
    'Roth Contributions',
    'Years to Retirement'
  ];

  var tableElements = _.each(labels, function(label) {
    //parent container
      //input table element
        //row container
          //input box
          //input label

  });
};
