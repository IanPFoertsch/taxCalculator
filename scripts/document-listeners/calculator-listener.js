function CalculatorListener() {}

CalculatorListener.prepare = function() {
  var taxes = {
    'Federal Income Tax': TaxCalculator.federalIncomeTax,
    'Social Security Withholding': TaxCalculator.socialSecurityWithholding,
    'Medicare Withholding': TaxCalculator.medicareWithholding
  };


  var populateTable = function(table, defaultValue) {
    _.forEach(taxes, function(func, name) {
      row = table.insertRow();
      nameCell = row.insertCell(0);

      nameCell.innerHTML = name;
      //insert a value cell
      valueCell = row.insertCell(1);
      valueCell.innerHTML = defaultValue;
    });
  };
  populateTable(document.getElementById('tax-table'), "$0.0");

  var clearTableValues = function (table) {
    _.forEach(table.rows, (function(row) {
      row.cells[1].innerHTML = "$0.0";
    }));

    return table;
  };

  document.getElementById("calculateButton").addEventListener("click", function(){
    var grossIncome = document.getElementById("grossIncome").value;

    table = clearTableValues(document.getElementById('tax-table'));

    _.forEach(taxes, function(tax, name, index) {
      var row = _.find(table.rows, function(row) {
        //TODO: update this to store references to the pertinent cells
        return row.innerText.match(name);
      });
      valueCell = row.cells[1];
      taxValue = tax(grossIncome);
      valueCell.innerHTML = '$' + taxValue.toFixed(2);
    });
  });
};
