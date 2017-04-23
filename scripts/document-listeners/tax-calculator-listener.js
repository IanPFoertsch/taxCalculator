function TaxCalculatorListener() {}

TaxCalculatorListener.prepare = function() {
  var taxes = {
    'Federal Income Tax': TaxCalculator.federalIncomeTax,
    'Social Security Withholding': TaxCalculator.socialSecurityWithholding,
    'Medicare Withholding': TaxCalculator.medicareWithholding,
    'Net Income': TaxCalculator.netIncome
  };


  var populateTable = function(table, defaultValue) {
    //TODO: This is a bad way to create a table, with a great deal
    // of custom logic. Consolidate this to a re-useable shared class
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
      if (row.cells[1]) {
        row.cells[1].innerHTML = "$0.0";
      }

    }));

    return table;
  };

  document.getElementById("calculateButton").addEventListener("click", function(){
    var grossIncome = document.getElementById("grossIncome").value;

    table = clearTableValues(document.getElementById('tax-table'));

    _.forEach(taxes, function(tax, name, index) {
      var row = _.find(table.rows, function(row) {
        //TODO: update this to store references to the pertinent cells
        //to avoid this dumb stuff

        return row.innerText.match(name);
      });
      valueCell = row.cells[1];
      taxValue = tax(grossIncome);
      valueCell.innerHTML = '$' + taxValue.toFixed(2);
    });
  });
};
