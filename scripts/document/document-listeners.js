document.addEventListener("DOMContentLoaded", function() {
  var taxes = [
    federalIncomeTax,
    socialSecurityWithholding,
    medicareWithholding
  ];

  function populateTable(table, defaultValue) {
    _.forEach(taxes, function(tax) {
      row = table.insertRow();
      nameCell = row.insertCell(0);
      nameCell.innerHTML = tax.name;
      //insert a value cell
      valueCell = row.insertCell(1);
      valueCell.innerHTML = defaultValue;
    });
  }
  populateTable(document.getElementById('tax-table'), "$0.0");

  function clearTableValues(table) {
    _.forEach(table.rows, (function(row) {
      row.cells[1].innerHTML = "";
    }));

    return table;
  }

  document.getElementById("calculateButton").addEventListener("click", function(){
    var grossIncome = document.getElementById("grossIncome").value;

    table = clearTableValues(document.getElementById('tax-table'));

    _.forEach(taxes, function(tax, index) {
      row = table.rows[index];
      valueCell = row.cells[1];
      taxValue = tax(grossIncome);
      valueCell.innerHTML = '$' + taxValue.toFixed(2);
    });
  });
});
